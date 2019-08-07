import DynamoData from './dynamo';
import { DocumentClient, UpdateItemInput } from 'aws-sdk/clients/dynamodb';

const uuidv4 = require('uuid/v4');
const USER_TABLE = 'Users';

//#region arg type interfaces
export interface GetUserInfoArgs {
  user_id : string;
}

export interface CreateUserArgs {
  handle : string;
  name : string;
}

export interface UpdateUserArgs {
  user_id : string;
  handle : string;
  name : string;
  first_name : string;
  last_name : string;
  phone : string;
}

export interface LinkSiteArgs {
  user_id: string;
  site_id : string;
}

export interface RemoveSiteArgs {
  user_id: string;
  site_id : string;
}

export interface UserResponse {
  user_id : string;
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
    console.log(args);
    const params : DocumentClient.GetItemInput = {
      Key: {
        "user_id": args.user_id,
      },
      TableName: USER_TABLE
    };
    console.log(params);
    const result = await this.db.get(params);
    console.log(result);
    return result.Item as UserResponse;
  }

  async createUser(args : CreateUserArgs) : Promise<UserResponse>  {
    var userId = uuidv4();
    const params : DocumentClient.PutItemInput = {
      TableName: USER_TABLE,
      Item: {
        user_id: userId,
        handle: args.handle,
        name: args.name,
      },
    };
    const result = this.db.createItem(params);
    return await this.getUserInfo({ user_id : userId});
  }

  async updateUser(args : UpdateUserArgs) : Promise<UserResponse>  {
    const params : DocumentClient.UpdateItemInput = {
      TableName: USER_TABLE,
      Key: {
        user_id: args.user_id,
      },
      ExpressionAttributeValues: {
        ':first_name': args.first_name,
        ':last_name': args.last_name,
        ':phone': args.phone,
        ':handle' : args.handle
      },
      UpdateExpression: 'SET first_name = :first_name, last_name = :last_name, phone = :phone',
      ReturnValues: 'ALL_NEW',
    };

    const result = this.db.updateItem(params, args);
    return await this.getUserInfo({ user_id : args.user_id});
  }
  
  async linkSite(args : LinkSiteArgs) : Promise<UserResponse> {
    const params : DocumentClient.UpdateItemInput = {
      TableName: USER_TABLE,
      Key: {
        user_id: args.user_id
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
    return await this.getUserInfo({user_id : args.user_id});
  }

  async removeSite(args : RemoveSiteArgs) : Promise<UserResponse> {
    const params : DocumentClient.UpdateItemInput = {
      TableName: USER_TABLE,
      Key: {
        user_id: args.user_id
      },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'remove #site.#siteid',
      ExpressionAttributeNames: {
        '#site': 'site',
        '#siteid' : args.site_id
      },
    };
    const result = await this.db.updateItem(params, args);
    return await this.getUserInfo({ user_id : args.user_id});
  }

}