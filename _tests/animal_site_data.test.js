"use strict";
import AnimalSiteData from "../data/animal_site";
import DynamoData from "../data/dynamo";

jest.mock('../data/dynamo');

beforeEach(() => {
    DynamoData.mockClear();
});

it('AnimalSiteData should be a function', () => {
    expect(typeof AnimalSiteData).toBe('function');
});

it('AnimalSiteData animalIds should query', () => {
    const animalSiteData = new AnimalSiteData();
    const mockQuery = DynamoData.mock.instances[0].query;
    
    animalSiteData.getAnimalSiteDataBySiteIDs(["1","2"]);
    
    expect(DynamoData).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
});