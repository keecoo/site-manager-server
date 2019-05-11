import DynamoData from './dynamo';

const uuidv4 = require('uuid/v4');
const SITE_TABLE = 'Sites';

export default class SiteData {
  db: DynamoData;
  constructor() {
    this.db = new DynamoData();
  }

  getSitesData(siteIds) {
    console.log(siteIds);
    let keys = [];
    for (var siteid in siteIds) {
        keys.push({site_id : siteid});
    }
    const params = {
      RequestItems: {
        Sites: {
          Keys: keys
        }
      }
    };
    return this.db.getBatch(params);
  }

  createSite(args) {
    const params = {
      TableName: SITE_TABLE,
      Item: {
        site_id: uuidv4(),
        site_name: args.site_name,
        description: args.description,
        location: {
          latitude: 41.0833976,
          longitude: -112.0532486,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        },
        image_url: "http://www.google.com"
      },
    };
    return this.db.createItem(params);
  }

  updateSite(args) {
    const params = {
      TableName: SITE_TABLE,
      Key: {
        site_id: args.site_id,
      },
      ExpressionAttributeValues: {
        ':site_name': args.site_name,
        ':description': args.description
      },
      UpdateExpression: 'SET site_name = :site_name, description = :description',
      ReturnValues: 'ALL_NEW',
    };

    return this.db.updateItem(params, args);
  }

  getSiteData(siteId) {
    var params = {
      Key: {
        "site_id": siteId,
      },
      TableName: SITE_TABLE
    };
    return this.db.get(params);
  }
}