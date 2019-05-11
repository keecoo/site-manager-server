"use strict";
import DynamoData from './dynamo';

const USER_TABLE = 'Users';

// eslint-disable-next-line import/prefer-default-export
export default class UserData {
  constructor() {
    this.db = new DynamoData();
  }

  getUserInfo(args) {
    var params = {
      Key: {
        "handle": args.handle,
      },
      TableName: "Users"
    };
    return this.db.get(params);
  }

  createUser(args) {
    const params = {
      TableName: USER_TABLE,
      Item: {
        handle: args.handle,
        name: args.name,
      },
    };
    return this.db.createItem(params);
  }

  updateUser(args) {
    const params = {
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
  
  linkSite(args) {
    const params = {
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

  removeSite(args) {
    const params = {
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