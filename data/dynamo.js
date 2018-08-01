import dynamodb from 'serverless-dynamodb-client';
import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

if (process.env.NODE_ENV === 'production') {
    docClient = new AWS.DynamoDB.DocumentClient();
} else {
    docClient = dynamodb.doc;
}


export function scan(params) {
    return new Promise((resolve, reject) =>
        docClient.scan(params).promise()
        .then(data => resolve(data.Items))
        .catch(err => reject(err)),
    );
}

export function query(params) {
    return new Promise((resolve, reject) =>
        docClient.query(params).promise()
        .then(data => resolve(data.Items))
        .catch(err => reject(err)),
    );
}

export function get(params) {
    return new Promise((resolve, reject) =>
        docClient.get(params).promise()
        .then(data => resolve(data.Item))
        .catch(err => reject(err)),
    );
}

export function getBatch(params) {
    return new Promise((resolve, reject) =>
        docClient.batchGet(params).promise()
        .then(data => resolve(data))
        .catch(err => reject(err)),
    );
}

export function createItem(params) {
    return new Promise((resolve, reject) =>
        docClient.put(params).promise()
        .then(() => resolve(params.Item))
        .catch(err => reject(err)),
    );
}

export function updateItem(params, args) {
    return new Promise((resolve, reject) =>
        docClient.update(params).promise()
        .then(() => resolve(args))
        .catch(err => reject(err)),
    );
}

export function deleteItem(params, args) {
    return new Promise((resolve, reject) =>
        docClient.delete(params).promise()
        .then(() => resolve(args))
        .catch(err => reject(err)),
    );
}