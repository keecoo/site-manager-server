import * as db from './dynamo';

const USER_TABLE = 'Users';

const data = {
  getUserInfo(args) {
    var params = {
      Key: {
        "handle": args.handle,
      },
      TableName: "Users"
    };
    return db.get(params);

  },
  createUser(args) {
    const params = {
      TableName: USER_TABLE,
      Item: {
        handle: args.handle,
        name: args.name,
      },
    };
    return db.createItem(params);
  },
  updateUser(args) {
    const params = {
      TableName: USER_TABLE,
      Key: {
        handle: args.handle,
      },
      ExpressionAttributeValues: {
        ':first_name': args.first_name,
        ':last_name': args.last_name,
        ':phone': args.phone,
      },
      UpdateExpression: 'SET first_name = :first_name, last_name = :last_name, phone = :phone',
      ReturnValues: 'ALL_NEW',
    };

    return db.updateItem(params, args);
  },
  linkSite(args) {
    const params = {
      TableName: USER_TABLE,
      Key: {
        handle: args.handle
      },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'set #site = list_append(if_not_exists(#site, :empty_list), :site)',
      ExpressionAttributeNames: {
        '#site': 'site'
      },
      ExpressionAttributeValues: {
        ':site': [args.site_id],
        ':empty_list': []
      }
    };
    return db.updateItem(params, args);
  }

};

// eslint-disable-next-line import/prefer-default-export
module.exports = {
  getUserInfo: (args) => data.getUserInfo(args),
  createUser: (args) => data.createUser(args),
  updateUser: (args) => data.updateUser(args),
  linkSite: (args) => data.linkSite(args),
};