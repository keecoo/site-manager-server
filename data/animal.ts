import DynamoData from './dynamo';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';


const uuidv4 = require('uuid/v4');
const ANIMAL_TABLE = 'Animals';

interface createAnimalArgs {
  animal_name: string;
  description: string;
  image_url: string;
  sex: string;
  breed : string;
  status: string;
  status_date: string;
}

interface updateAnimalArgs {
  animal_id: string;
  animal_name: string;
  description: string;
  image_url: string;
  sex: string;
  breed : string;
  status: string;
  status_date: string;
}

export default class AnimalData {
  db: DynamoData;
  constructor() {
    this.db = new DynamoData();
  }

  getAnimalsByAnimalIds(animalIds : string[]) {
    const keys = animalIds.map(a => {
      return {
        animal_id: a
      }
    });
    const params : DocumentClient.BatchGetItemInput = {
      RequestItems: {
        Animals: {
          Keys: keys
        }
      }
    };

    return this.db.getBatch(params);
  }

  getAnimalData(animal_id : string) {
    const params : DocumentClient.GetItemInput = {
      Key: {
        "animal_id": animal_id,
      },
      TableName: ANIMAL_TABLE
    };

    return this.db.get(params);
  }

  createAnimal(args : createAnimalArgs) {
    const params : DocumentClient.PutItemInput = {
      TableName: ANIMAL_TABLE,
      Item: {
        animal_id: uuidv4(),
        animal_name: args.animal_name,
        description: args.description,
        image_url: args.image_url,
        sex: args.sex,
        breed : args.breed,
        status: args.status,
        status_date: args.status_date

      },
    };
    return this.db.createItem(params);
  }

  updateAnimal(args : updateAnimalArgs) {
    const params : DocumentClient.UpdateItemInput = {
      TableName: ANIMAL_TABLE,
      Key: {
        animal_id: args.animal_id,
      },
      ExpressionAttributeValues: {
        ':animal_name': args.animal_name,
        ':description' : args.description,
        ':image_url' : args.image_url,
        ':sex' : args.sex,
        ':breed' : args.breed,
        ':status' : args.status,
        ':status_date' : args.status_date  
      },
      UpdateExpression: 'SET animal_name = :animal_name, description = :description, image_url = :image_url, sex = :sex, breed = :breed, status = :status, status_date = :status_date',
      ReturnValues: 'ALL_NEW',
    };

    return this.db.updateItem(params, args);
  }


}