const dynamodb = require('serverless-dynamodb-client');
import AWS = require('aws-sdk');
//import * as AWS from 'aws-sdk'
import DocumentClient = AWS.DynamoDB.DocumentClient;
import Request = AWS.Request;
import AWSError = AWS.AWSError;
import { PromiseResult } from 'aws-sdk/lib/request';


export default class DynamoData {
    docClient: DocumentClient;

    constructor() {
        if (process.env.NODE_ENV === 'production') {
            this.docClient = new AWS.DynamoDB.DocumentClient();
        } else {
            this.docClient = dynamodb.doc;
        }  
    }

    scan(params : DocumentClient.ScanInput) : Promise<DocumentClient.ScanOutput> {
        return new Promise((resolve, reject) =>
            this.docClient.scan(params).promise()
                .then((data : DocumentClient.ScanOutput) => resolve(data))
                .catch((err : AWSError) => reject(err))
        );
    }
    
    query(params : DocumentClient.QueryInput) : Promise<DocumentClient.QueryOutput> {
        return new Promise((resolve, reject) =>
            this.docClient.query(params).promise()
                .then((data :DocumentClient.QueryOutput) => resolve(data))
                .catch(err => reject(err))
        );
    }
    
    get(params : DocumentClient.GetItemInput) : Promise<DocumentClient.GetItemOutput> {
        return new Promise((resolve, reject) =>
            this.docClient.get(params).promise()
                .then((data : DocumentClient.GetItemOutput) => resolve(data))
                .catch(err => reject(err))
        );
    }
    
    getBatch(params : DocumentClient.BatchGetItemInput) : Promise<DocumentClient.BatchGetItemOutput> {
        return new Promise((resolve, reject) =>
            this.docClient.batchGet(params).promise()
                .then((data : DocumentClient.BatchGetItemOutput) => resolve(data))
                .catch(err => reject(err))
        );
    }
    
    createItem(params : DocumentClient.PutItemInput) : Promise<DocumentClient.PutItemOutput> {
        return new Promise((resolve, reject) =>
            this.docClient.put(params).promise()
                .then((data : DocumentClient.PutItemOutput) => resolve(data))
                .catch(err => reject(err))
        );
    }
    
    updateItem(params : DocumentClient.UpdateItemInput, args) : Promise<any> {
        return new Promise((resolve, reject) =>
            this.docClient.update(params).promise()
                .then(() => resolve(args))
                .catch(err => reject(err))
        );
    }
    
    deleteItem(params : DocumentClient.DeleteItemInput, args) : Promise<any> {
        return new Promise((resolve, reject) =>
        this.docClient.delete(params).promise()
            .then(() => resolve(args))
            .catch(err => reject(err))
        );
    }
};