import AnimalData from './data/animal'
import AnimalSiteData from './data/animal_site';
import SiteData  from './data/site';
import UserData from './data/user';

const userData = new UserData();
const animalData = new AnimalData();
const siteData = new SiteData();
const animalSiteData = new AnimalSiteData();
  
async function asyncGetAnimal(animal_id) {
  const animal = await animalData.getAnimalData(animal_id);
  return animal;
}

async function asyncGetSiteInfo(site_id) {
  const site = await siteData.getSiteData(site_id);
  return site;
}

async function asyncCreateSite(args) {
  const site = await siteData.createSite(args);
  const user = await userData.linkSite({
    handle: args.handle,
    site_id: site.site_id
  });
  return site;
}

async function asyncGetUserSite(handle, siteList, args) {
  const sites = await siteData.getSitesData(siteList);
  return sites.Responses.Sites;
}

async function asyncGetSiteAnimals(site_id) {
  const items = await animalSiteData.getAnimalSiteDataBySiteIDs(site_id);
  if (items.length === 0) {
    return [];
  }
  const animalIds = items.map(s => s.animal_id);
  const animalResponse = await animalData.getAnimalsByAnimalIds(animalIds);
  return animalResponse.Responses.Animals;
}

const data = {
  getPaginatedUserSites(handle, args) {
    return asyncGetUserSite(handle, args).then(result => {
      return {
        items: result
      };
    }).catch(err => {
      console.log(err);
    });
  },
  getSiteAnimals(site_id, args) {
    return asyncGetSiteAnimals(site_id, args).then(result => {
      return {
        items: result
      };
    }).catch(err => {
      console.log(err);
    });
  },
  getAnimal(args) {
    return asyncGetAnimal(args.animal_id).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
  getSiteInfo(args) {
    return asyncGetSiteInfo(args.site_id).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
  createSiteAndLink(args) {
    return asyncCreateSite(args).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
};

// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    getUserInfo: (_, args) => userData.getUserInfo(args),
    getAnimal: (_, args) => data.getAnimal(args),
    getSiteInfo: (_, args) => data.getSiteInfo(args),
  },
  Mutation: {
    createUser: (_, args) => userData.createUser(args),
    updateUser: (_, args) => userData.updateUser(args),
    createSite: (_, args) => data.createSite(args),
    createSiteAndLink: (_, args) => data.createSiteAndLink(args),
  },
  User: {
    siteInfo: (obj, args) => data.getPaginatedUserSites(obj.handle, obj.site, args),
  },
  Site: {
    animals: (obj, args) => data.getSiteAnimals(obj.site_id, args),
  }
};