import DynamoData from './dynamo';

const uuidv1 = require('uuid/v1');
const SITE_TABLE = 'Sites';

export default class SiteData {
  getSitesData(siteIds) {
    const db = new DynamoData();
    let keys = siteIds.map(s => {
      return {
        site_id: s
      }
    });
    const params = {
      RequestItems: {
        Sites: {
          Keys: keys
        }
      }
    };
    return db.getBatch(params);
  }
  createSite(args) {
    const db = new DynamoData();
    const params = {
      TableName: SITE_TABLE,
      Item: {
        site_id: uuidv1(),
        site_name: args.site_name,
        description: args.description,
      },
    };
    return db.createItem(params);
  }
  getSiteData(siteId) {
    const db = new DynamoData();
    var params = {
      Key: {
        "site_id": siteId,
      },
      TableName: SITE_TABLE
    };
    return db.get(params);
  }
}