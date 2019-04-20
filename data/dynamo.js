const dynamodb = require('serverless-dynamodb-client');
const AWS = require('aws-sdk');



export default class DynamoData {
    getDocClient() {
        if (process.env.NODE_ENV === 'production') {
            return new AWS.DynamoDB.DocumentClient();
        } else {
            return dynamodb.doc;
        }  
    }

    scan(params) {
        const docClient = this.getDocClient();
        return new Promise((resolve, reject) =>
            docClient.scan(params).promise()
            .then(data => resolve(data.Items))
            .catch(err => reject(err)),
        );
    }
    
    query(params) {
        const docClient = this.getDocClient();
        return new Promise((resolve, reject) =>
            docClient.query(params).promise()
            .then(data => resolve(data.Items))
            .catch(err => reject(err)),
        );
    }
    
    get(params) {
        const docClient = this.getDocClient();
        return new Promise((resolve, reject) =>
            docClient.get(params).promise()
            .then(data => resolve(data.Item))
            .catch(err => reject(err)),
        );
    }
    
    getBatch(params) {
        const docClient = this.getDocClient();
        return new Promise((resolve, reject) =>
            docClient.batchGet(params).promise()
            .then(data => resolve(data))
            .catch(err => reject(err)),
        );
    }
    
    createItem(params) {
        const docClient = this.getDocClient();
        return new Promise((resolve, reject) =>
            docClient.put(params).promise()
            .then(() => resolve(params.Item))
            .catch(err => reject(err)),
        );
    }
    
    updateItem(params, args) {
        const docClient = this.getDocClient();
        return new Promise((resolve, reject) =>
            docClient.update(params).promise()
            .then(() => resolve(args))
            .catch(err => reject(err)),
        );
    }
    
    deleteItem(params, args) {
        const docClient = this.getDocClient();
        return new Promise((resolve, reject) =>
            docClient.delete(params).promise()
            .then(() => resolve(args))
            .catch(err => reject(err)),
        );
    }
};