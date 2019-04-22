"use strict";
import DynamoData from './dynamo';

const uuidv1 = require('uuid/v1');
const SITE_TABLE = 'Sites';

export default class SiteData {
  constructor() {
    this.db = new DynamoData();
  }

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
    return this.db.getBatch(params);
  }

  createSite(args) {
    const params = {
      TableName: SITE_TABLE,
      Item: {
        site_id: uuidv1(),
        site_name: args.site_name,
        description: args.description,
      },
    };
    return this.db.createItem(params);
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