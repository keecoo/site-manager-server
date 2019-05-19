import DynamoData from './dynamo';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';


const uuidv4 = require('uuid/v4');
const ANIMAL_TABLE = 'Animals';

//#region arg type interfaces


export interface CreateAnimalArgs {
  animal_name: string;
  description: string;
  image_url: string;
  sex: string;
  breed : string;
  status: string;
  status_date: string;
}

export interface UpdateAnimalArgs {
  animal_id: string;
  animal_name: string;
  description: string;
  image_url: string;
  sex: string;
  breed : string;
  status: string;
  status_date: string;
}

export interface AnimalResponse {
  animal_id: string;
  animal_name: string;
  description: string;
  image_url: string;
  sex: string;
  breed : string;
  status: string;
  status_date: string;
}

//#endregion

export default class AnimalData {
  db: DynamoData;
  constructor() {
    this.db = new DynamoData();
  }

  async getAnimalsByAnimalIds(animalIds : string[]) : Promise<Array<AnimalResponse>> {
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
    var response = await this.db.getBatch(params);
    return response.Responses.Animals as Array<AnimalResponse>;
  }

  async getAnimalData(animal_id : string) : Promise<AnimalResponse> {
    const params : DocumentClient.GetItemInput = {
      Key: {
        "animal_id": animal_id,
      },
      TableName: ANIMAL_TABLE
    };
    console.log('get animal')
    var response = await this.db.get(params);
    console.log(response);
    return response.Item as AnimalResponse;
  }

  async createAnimal(args : CreateAnimalArgs) : Promise<AnimalResponse> {
    var animalId = uuidv4();
    const params : DocumentClient.PutItemInput = {
      TableName: ANIMAL_TABLE,
      Item: {
        animal_id: animalId,
        animal_name: args.animal_name,
        description: args.description,
        image_url: args.image_url,
        sex: args.sex,
        breed : args.breed,
        status: args.status,
        status_date: args.status_date
      },
      ReturnValues : 'NONE'
    };
    try
    {
      var result = await this.db.createItem(params);
      return await this.getAnimalData(animalId);
    }
    catch (e) {
      console.log(e);
    }
  }

  async updateAnimal(args : UpdateAnimalArgs) : Promise<AnimalResponse> {
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
        ':status_date' : Date.now()
      },
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      UpdateExpression: 'SET animal_name = :animal_name, description = :description, image_url = :image_url, sex = :sex, breed = :breed, #status = :status, status_date = :status_date',
      ReturnValues: 'ALL_NEW',
    };

    await this.db.updateItem(params, args);
    return await this.getAnimalData(args.animal_id);
  }


}