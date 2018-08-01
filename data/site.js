import * as db from './dynamo';

const uuidv1 = require('uuid/v1');
const SITE_TABLE = 'Sites';

const data = {
  getSitesData(siteIds) {
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
  },
  createSite(args) {
    const params = {
      TableName: SITE_TABLE,
      Item: {
        site_id: uuidv1(),
        site_name: args.site_name,
        description: args.description,
      },
    };
    return db.createItem(params);
  },
  getSiteData(siteId) {
    var params = {
      Key: {
        "site_id": siteId,
      },
      TableName: SITE_TABLE
    };
    return db.get(params);
  }
}

module.exports = {
  createSite: (args) => data.createSite(args),
  getSitesData: (siteIds) => data.getSitesData(siteIds),
  getSiteData: (siteId) => data.getSiteData(siteId),
};