import DynamoData from './dynamo';

const uuidv4 = require('uuid/v4');
const ANIMAL_TABLE = 'Animals';


export default class AnimalData {
  db: DynamoData;
  constructor() {
    this.db = new DynamoData();
  }

  getAnimalsByAnimalIds(animalIds) {
    const keys = animalIds.map(a => {
      return {
        animal_id: a
      }
    });
    const params = {
      RequestItems: {
        Animals: {
          Keys: keys
        }
      }
    };

    return this.db.getBatch(params);
  }

  getAnimalData(animal_id : string) {
    const params = {
      Key: {
        "animal_id": animal_id,
      },
      TableName: ANIMAL_TABLE
    };

    return this.db.get(params);
  }

  createAnimal(args) {
    const params = {
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

  updateAnimal(args) {
    const params = {
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