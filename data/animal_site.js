import DynamoData from './dynamo';

const ANIMAL_SITE_TABLE = 'AnimalSites';


export default class AnimalSite {
  getAnimalSiteDataBySiteIDs(site_id) {
    const db = new DynamoData();
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
}