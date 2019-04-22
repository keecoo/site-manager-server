"use strict";
const dynamodb = require('serverless-dynamodb-client');
const AWS = require('aws-sdk');

export default class DynamoData {
    constructor() {
        if (process.env.NODE_ENV === 'production') {
            this.docClient = new AWS.DynamoDB.DocumentClient();
        } else {
            this.docClient = dynamodb.doc;
        }  
    }

    scan(params) {
        return new Promise((resolve, reject) =>
            this.docClient.scan(params).promise()
                .then(data => resolve(data.Items))
                .catch(err => reject(err))
        );
    }
    
    query(params) {
        return new Promise((resolve, reject) =>
            this.docClient.query(params).promise()
                .then(data => resolve(data.Items))
                .catch(err => reject(err))
        );
    }
    
    get(params) {
        return new Promise((resolve, reject) =>
            this.docClient.get(params).promise()
                .then(data => resolve(data.Item))
                .catch(err => reject(err))
        );
    }
    
    getBatch(params) {
        return new Promise((resolve, reject) =>
            this.docClient.batchGet(params).promise()
                .then(data => resolve(data))
                .catch(err => reject(err))
        );
    }
    
    createItem(params) {
        return new Promise((resolve, reject) =>
            this.docClient.put(params).promise()
                .then(() => resolve(params.Item))
                .catch(err => reject(err))
        );
    }
    
    updateItem(params, args) {
        return new Promise((resolve, reject) =>
            this.docClient.update(params).promise()
                .then(() => resolve(args))
                .catch(err => reject(err))
        );
    }
    
    deleteItem(params, args) {
        return new Promise((resolve, reject) =>
        this.docClient.delete(params).promise()
            .then(() => resolve(args))
            .catch(err => reject(err))
        );
    }
};