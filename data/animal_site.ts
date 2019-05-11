"use strict";
import DynamoData from './dynamo';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';


const ANIMAL_SITE_TABLE = 'AnimalSites';

interface AnimalSiteItem {
  animal_id : string;
  site_id : string;
}

export default class AnimalSite {
  db: DynamoData;
  constructor() {
    this.db = new DynamoData();
  }

  getAnimalSiteDataBySiteIDs(site_id : string) : AnimalSiteItem[] {
    const params : DocumentClient.QueryInput = {
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