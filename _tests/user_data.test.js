"use strict";
import UserData from "../data/user";
import DynamoData from "../data/dynamo";

jest.mock('../data/dynamo');

beforeEach(() => {
    DynamoData.mockClear();
});

it('UserData should be a function', () => {
    expect(typeof UserData).toBe('function');
});

it('UserData siteIds should get batch', () => {
    const userData = new UserData();
    const handle = "1";
    const mockGetBatch = DynamoData.mock.instances[0].get;
    
    userData.getUserInfo(handle);
    
    expect(DynamoData).toHaveBeenCalledTimes(1);
    expect(mockGetBatch).toHaveBeenCalledTimes(1);
});

