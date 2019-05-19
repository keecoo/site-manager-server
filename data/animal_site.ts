"use strict";
import DynamoData from './dynamo';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';


const ANIMAL_SITE_TABLE = 'AnimalSites';

//#region interfaces
interface AnimalSiteItem {
  animal_id : string;
  site_id : string;
}
//#endregion interfaces

export default class AnimalSite {
  db: DynamoData;
  constructor() {
    this.db = new DynamoData();
  }

  async getAnimalSiteDataBySiteIDs(site_id : string) : Promise<Array<AnimalSiteItem>> {
    const params : DocumentClient.QueryInput = {
      TableName: ANIMAL_SITE_TABLE,
      KeyConditionExpression: 'site_id = :v1',
      ExpressionAttributeValues: {
        ':v1': site_id,
      },
      IndexName: 'site-index',
      ScanIndexForward: false,
    };
    var result = await this.db.query(params);
    return result.Items as Array<AnimalSiteItem>;
  }
}