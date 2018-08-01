import * as db from './dynamo';

const ANIMAL_SITE_TABLE = 'AnimalSites';

const data = {
  getAnimalSiteDataBySiteIDs(site_id) {
    const params = {
      TableName: ANIMAL_SITE_TABLE,
      KeyConditionExpression: 'site_id = :v1',
      ExpressionAttributeValues: {
        ':v1': site_id,
      },
      IndexName: 'site-index',
      ScanIndexForward: false,
    };
    return db.query(params);
  }
};

module.exports = {
  getAnimalSiteDataBySiteIDs: (site_id) => data.getAnimalSiteDataBySiteIDs(site_id)
};