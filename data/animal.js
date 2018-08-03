import * as db from './dynamo';

const ANIMAL_TABLE = 'Animals';

const data = {
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

    return db.getBatch(params);
  },
  getAnimalData(animal_id) {
    const params = {
      Key: {
        "animal_id": animal_id,
      },
      TableName: ANIMAL_TABLE
    };

    return db.get(params);
  }
}

module.exports = {
  getAnimalsByAnimalIds: (animalIds) => data.getAnimalsByAnimalIds(animalIds),
  getAnimalData: (animal_id) => data.getAnimalData(animal_id),
};