"use strict";
import DynamoData from './dynamo';

const ANIMAL_TABLE = 'Animals';


export default class AnimalData {
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

  getAnimalData(animal_id) {
    const params = {
      Key: {
        "animal_id": animal_id,
      },
      TableName: ANIMAL_TABLE
    };

    return this.db.get(params);
  }
}