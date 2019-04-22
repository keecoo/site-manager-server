"use strict";
import SiteData from "../data/site";
import DynamoData from "../data/dynamo";

jest.mock('../data/dynamo');

beforeEach(() => {
    DynamoData.mockClear();
});

it('SiteData should be a function', () => {
    expect(typeof SiteData).toBe('function');
});

it('SiteData siteIds should get batch', () => {
    const siteData = new SiteData();
    const siteIds = ["1","2"];
    const mockGetBatch = DynamoData.mock.instances[0].getBatch;
    
    siteData.getSitesData(siteIds);
    
    const p = mockGetBatch.mock.calls[0][0];
    const keys = siteIds.map(a => {
        return {
            site_id: a
        }
    }); 
    expect(DynamoData).toHaveBeenCalledTimes(1);
    expect(p.RequestItems.Sites.Keys).toEqual(keys);
    expect(mockGetBatch).toHaveBeenCalledTimes(1);
});


it('SiteData get should call get', () => {
    const siteData = new SiteData();
    const siteId = "1";
    const mockGet = DynamoData.mock.instances[0].get;
    
    siteData.getSiteData(siteId);
    
    const p = mockGet.mock.calls[0][0];
    expect(DynamoData).toHaveBeenCalledTimes(1);
    expect(p.Key.site_id).toEqual(siteId);
    expect(mockGet).toHaveBeenCalledTimes(1);
});