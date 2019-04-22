"use strict";
import DynamoData from './dynamo';

const ANIMAL_SITE_TABLE = 'AnimalSites';

export default class AnimalSite {
  constructor() {
    this.db = new DynamoData();
  }

  getAnimalSiteDataBySiteIDs(site_id) {
    const params = {
      TableName: ANIMAL_SITE_TABLE,
      KeyConditionExpression: 'site_id = :v1',
      ExpressionAttributeValues: {
        ':v1': site_id,
      },
      IndexName: 'site-index',
      ScanIndexForward: false,
    };
    return this.db.query(params);
  }
}