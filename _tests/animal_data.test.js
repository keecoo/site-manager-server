"use strict";
import AnimalData from "../data/animal";
import DynamoData from "../data/dynamo";

jest.mock('../data/dynamo');
beforeEach(() => {
    DynamoData.mockClear();
});

it('AnimalData should be a function', () => {
    expect(typeof AnimalData).toBe('function');
});

it('AnimalData animalIds should get batch', () => {
    const animalData = new AnimalData();
    const animalIds = ["1","2"];
    const mockGetBatch = DynamoData.mock.instances[0].getBatch;
    
    animalData.getAnimalsByAnimalIds(animalIds);
    
    const p = mockGetBatch.mock.calls[0][0];
    const keys = animalIds.map(a => {
        return {
            animal_id: a
        };
    }); 
    expect(DynamoData).toHaveBeenCalledTimes(1);
    expect(p.RequestItems.Animals.Keys).toEqual(keys);
    expect(mockGetBatch).toHaveBeenCalledTimes(1);
});


it('AnimalData get should call get', () => {
    const animalData = new AnimalData();
    const animalId = "1";
    const mockGet = DynamoData.mock.instances[0].get;
    
    animalData.getAnimalData(animalId);
    
    const p = mockGet.mock.calls[0][0];
    expect(DynamoData).toHaveBeenCalledTimes(1);
    expect(p.Key.animal_id).toEqual(animalId);
    expect(mockGet).toHaveBeenCalledTimes(1);
});