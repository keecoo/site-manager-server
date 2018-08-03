const Animal = require('./data/animal');
const AnimalSite = require('./data/animal_site');
const Site = require('./data/site');
const User = require('./data/user');

async function asyncGetAnimal(animal_id) {
  const animal = await Animal.getAnimalData(animal_id);
  return animal;
}

async function asyncGetSiteInfo(site_id) {
  const site = await Site.getSiteData(site_id);
  return site;
}

async function asyncCreateSite(args) {
  const site = await Site.createSite(args);
  const user = await User.linkSite({
    handle: args.handle,
    site_id: site.site_id
  });
  return site;
}

async function asyncGetUserSite(handle, siteList, args) {
  const sites = await Site.getSitesData(siteList);
  return sites.Responses.Sites;
}

async function asyncGetSiteAnimals(site_id) {
  const items = await AnimalSite.getAnimalSiteDataBySiteIDs(site_id);
  if (items.length === 0) {
    return [];
  }
  const animalIds = items.map(s => s.animal_id);
  const animalResponse = await Animal.getAnimalsByAnimalIds(animalIds);
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
    getUserInfo: (_, args) => User.getUserInfo(args),
    getAnimal: (_, args) => data.getAnimal(args),
    getSiteInfo: (_, args) => data.getSiteInfo(args),
  },
  Mutation: {
    createUser: (_, args) => User.createUser(args),
    updateUser: (_, args) => User.updateUser(args),
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