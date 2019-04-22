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
      UpdateExpression: 'set #site = list_append(if_not_exists(#site, :empty_list), :site)',
      ExpressionAttributeNames: {
        '#site': 'site'
      },
      ExpressionAttributeValues: {
        ':site': [args.site_id],
        ':empty_list': []
      }
    };
    return this.db.updateItem(params, args);
  }

}