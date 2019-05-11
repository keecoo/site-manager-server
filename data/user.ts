import DynamoData from './dynamo';
import { DocumentClient, UpdateItemInput } from 'aws-sdk/clients/dynamodb';

const USER_TABLE = 'Users';

//#region arg type interfaces
interface getUserInfoArgs {
  handle : string;
}

interface createUserArgs {
  handle : string;
  name : string;
}

interface updateUserArgs {
  handle : string;
  name : string;
  first_name : string;
  last_name : string;
  phone : string;
}

interface linkSiteArgs {
  handle: string;
  site_id : string;
}

interface removeSiteArgs {
  handle: string;
  site_id : string;
}
//#endregion

export default class UserData {
  db: DynamoData;
  constructor() {
    this.db = new DynamoData();
  }

  getUserInfo(args : getUserInfoArgs) {
    const params : DocumentClient.GetItemInput = {
      Key: {
        "handle": args.handle,
      },
      TableName: USER_TABLE
    };
    return this.db.get(params);
  }

  createUser(args : createUserArgs) {
    const params : DocumentClient.PutItemInput = {
      TableName: USER_TABLE,
      Item: {
        handle: args.handle,
        name: args.name,
      },
    };
    return this.db.createItem(params);
  }

  updateUser(args : updateUserArgs) {
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

    return this.db.updateItem(params, args);
  }
  
  linkSite(args : linkSiteArgs) {
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
    return this.db.updateItem(params, args);
  }

  removeSite(args : removeSiteArgs) {
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
    return this.db.updateItem(params, args);
  }

}