import DynamoData from './dynamo';
import { DocumentClient, UpdateItemInput } from 'aws-sdk/clients/dynamodb';

const USER_TABLE = 'Users';

//#region arg type interfaces
export interface GetUserInfoArgs {
  handle : string;
}

export interface CreateUserArgs {
  handle : string;
  name : string;
}

export interface UpdateUserArgs {
  handle : string;
  name : string;
  first_name : string;
  last_name : string;
  phone : string;
}

export interface LinkSiteArgs {
  handle: string;
  site_id : string;
}

export interface RemoveSiteArgs {
  handle: string;
  site_id : string;
}

export interface UserResponse {
  handle : string;
  name : string;
  first_name : string;
  last_name : string;
  phone : string;

}
//#endregion

export default class UserData {
  db: DynamoData;
  constructor() {
    this.db = new DynamoData();
  }

  async getUserInfo(args : GetUserInfoArgs) : Promise<UserResponse> {
    const params : DocumentClient.GetItemInput = {
      Key: {
        "handle": args.handle,
      },
      TableName: USER_TABLE
    };
    const result = await this.db.get(params);
    return result.Item as UserResponse;
  }

  async createUser(args : CreateUserArgs) : Promise<UserResponse>  {
    const params : DocumentClient.PutItemInput = {
      TableName: USER_TABLE,
      Item: {
        handle: args.handle,
        name: args.name,
      },
    };
    const result = this.db.createItem(params);
    return await this.getUserInfo({ handle : args.handle});
  }

  async updateUser(args : UpdateUserArgs) : Promise<UserResponse>  {
    const params : DocumentClient.UpdateItemInput = {
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

    const result = this.db.updateItem(params, args);
    return await this.getUserInfo({ handle : args.handle});
  }
  
  async linkSite(args : LinkSiteArgs) : Promise<UserResponse> {
    const params : DocumentClient.UpdateItemInput = {
      TableName: USER_TABLE,
      Key: {
        handle: args.handle
      },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'set #site.#siteid = :site',
      ExpressionAttributeNames: {
        '#site': 'site',
        '#siteid' : args.site_id
      },
      ExpressionAttributeValues: {
        ':site': {"site_id" : args.site_id}
      },
      ConditionExpression : "attribute_not_exists(#site.#siteid)"
    };
    const result = await this.db.updateItem(params, args);
    return await this.getUserInfo({handle : args.handle});
  }

  async removeSite(args : RemoveSiteArgs) : Promise<UserResponse> {
    const params : DocumentClient.UpdateItemInput = {
      TableName: USER_TABLE,
      Key: {
        handle: args.handle
      },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'remove #site.#siteid',
      ExpressionAttributeNames: {
        '#site': 'site',
        '#siteid' : args.site_id
      },
    };
    const result = await this.db.updateItem(params, args);
    return await this.getUserInfo({ handle : args.handle});
  }

}