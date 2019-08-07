import { ApolloServer } from 'apollo-server-lambda';
const { applyMiddleware } = require('graphql-middleware')
const { makeExecutableSchema } = require('graphql-tools')
import { rule, shield, and, or, not } from 'graphql-shield'
import { schema } from './schema';
import { resolvers } from './resolvers';

var jwt = require('jsonwebtoken');
var jwksClient = require('jwks-rsa');
var client = jwksClient({
  cache: true,
  cacheMaxEntries: 50, // Default value
  jwksUri: 'https://feralfinder.auth0.com/.well-known/jwks.json'
});


const getKey = (header) => new Promise((resolve, reject) => {
  client.getSigningKey(header.kid, (error, key) => {
    error ? reject(error) : resolve(key.publicKey || key.rsaPublicKey);
  });
});

// async function getUserFromRequest(req) {
//   const auth = req.headers['Authorization'];
//   console.log(auth);
//   var data = jwt.decode(auth, { complete: true});
//   try {
//     console.log('getting key')
//     var key = await getKey(data.header);
//   } catch(e) {
//     console.error('failed to get key')
//   }
//   var user = jwt.verify(auth, key, { algorithms: ['RS256'] });
//   console.log(user)
//   return user;
// }

async function getUser(ctx)  : Promise<any>{
  console.log('getting user');

  const auth = ctx.headers['Authorization'];
  //console.log(auth);
  var data = jwt.decode(auth, { complete: true});
  var key, user;
  try {
    console.log('getting key')
    key = await getKey(data.header);
  } catch(e) {
    console.error('failed to get key', e)
  }
  try {
    user = jwt.verify(auth, key, { algorithms: ['RS256'] });
  } catch(e) {
    if (e && e.name === 'TokenExpiredError') {
      console.log(e)
    } else {
      console.error(e)
    }
    return null;
  }
  
  ctx.user = user;
  return user;

}

const isAuthenticated = rule()(
  async (parent, args, ctx, info) => {
    //return true;
    var user = await getUser(ctx);
    console.log('got user')
    console.log(user);
    ctx.user = user;
    return user !== null;
  }
)

const permissions = shield({
  Query: {
    getUserInfo: isAuthenticated,
  },
})

const schemaStuff = applyMiddleware(
  makeExecutableSchema({
    typeDefs: schema,
    resolvers,
  }),
  permissions,
)

const server = new ApolloServer({
  schema: schemaStuff,
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context: req => ({
      ...req,
      //user: getUserFromRequest(req),
    })
  }),
  playground: {
    endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT ? 
      process.env.REACT_APP_GRAPHQL_ENDPOINT
      : '/production/graphql',
  },
  tracing: true,
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
  },
});
