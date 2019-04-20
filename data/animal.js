import DynamoData from './dynamo';

const ANIMAL_TABLE = 'Animals';


export default class AnimalData {
  getAnimalsByAnimalIds(animalIds) {
    const db = new DynamoData();
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

    return db.getBatch(params);
  }

  getAnimalData(animal_id) {
    const db = new DynamoData();
    const params = {
      Key: {
        "animal_id": animal_id,
      },
      TableName: ANIMAL_TABLE
    };

    return db.get(params);
  }
}