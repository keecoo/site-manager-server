import DynamoData from './dynamo';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';


const uuidv4 = require('uuid/v4');
const SITE_TABLE = 'Sites';

//#region interfaces
export interface CreateSiteArgs {
  site_name : string;
  description : string;
  handle : string;
}

export interface UpdateSiteArgs {
  site_id : string;
  site_name : string;
  description : string;
}

export interface SiteResponse {
  site_id : string;
  site_name : string;
  description : string;
  image_url : string;
}
//#endregion interfaces

export default class SiteData {
  db: DynamoData;
  constructor() {
    this.db = new DynamoData();
  }

  async getSitesData(siteIds) : Promise<Array<SiteResponse>> {
    console.log(siteIds);
    let keys = [];
    for (var siteid in siteIds) {
        keys.push({site_id : siteid});
    }
    const params : DocumentClient.BatchGetItemInput = {
      RequestItems: {
        Sites: {
          Keys: keys
        }
      }
    };
    const result = await this.db.getBatch(params);
    return result.Responses.Sites as Array<SiteResponse>;
  }

  async createSite(args : CreateSiteArgs) : Promise<SiteResponse> {
    const siteId = uuidv4();
    const params : DocumentClient.PutItemInput = {
      TableName: SITE_TABLE,
      Item: {
        site_id: siteId,
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
    const result = this.db.createItem(params);
    return await this.getSiteData(siteId);
  }

  async updateSite(args : UpdateSiteArgs) : Promise<SiteResponse> {
    const params : DocumentClient.UpdateItemInput = {
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

    const result = await this.db.updateItem(params, args);
    return await this.getSiteData(args.site_id);
  }

  async getSiteData(siteId : string) : Promise<SiteResponse> {
    const params : DocumentClient.GetItemInput = {
      Key: {
        "site_id": siteId,
      },
      TableName: SITE_TABLE
    };
    const result = await this.db.get(params);
    return result.Item as SiteResponse;
  }
}