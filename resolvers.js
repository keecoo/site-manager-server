"use strict";
import AnimalData from './data/animal';
import AnimalSiteData from './data/animal_site';
import SiteData  from './data/site';
import UserData from './data/user';


class HandlerService {
  constructor() {
    this.userData = new UserData();
    this.animalData = new AnimalData();
    this.siteData = new SiteData();
    this.animalSiteData = new AnimalSiteData();    
  }
  
  async asyncGetAnimal(animal_id) {
    return await this.animalData.getAnimalData(animal_id);    
  }

  async asyncCreateAnimal(args) {
    return await this.animalData.createAnimal(args);
  }
  
  async asyncUpdateAnimal(args) {
    return await this.animalData.updateAnimal(args);
  }
  
  async asyncGetSiteInfo(site_id) {
    return await this.siteData.getSiteData(site_id);
  }
  
  async asyncCreateSite(args) {
    const site = await this.siteData.createSite(args);
    await this.userData.linkSite({
      handle: args.handle,
      site_id: site.site_id
    });
    return site;
  }
  
  async asyncUpdateSite(args) {
    const site = await this.siteData.updateSite(args);
    return site;
  }
  
  async asyncRemoveSiteLink(args) {
    await this.userData.removeSite({
      handle: args.handle,
      site_id: args.site_id
    });
    return await this.userData.getUserInfo(args);
  }
  
  async asyncGetUserSite(handle, siteList, args) {
    const sites = await this.siteData.getSitesData(siteList);
    return sites.Responses.Sites;
  }
  
  async asyncCreateUser(args) {
    return await this.userData.createUser(args);
  }
  
  async asyncUpdateUser(args) {
    return await this.userData.updateUser(args);
  }
  
  async asyncGetSiteAnimals(site_id) {
    const items = await this.animalSiteData.getAnimalSiteDataBySiteIDs(site_id);
    if (items.length === 0) {
      return [];
    }
    const animalIds = items.map(s => s.animal_id);
    const animalResponse = await this.animalData.getAnimalsByAnimalIds(animalIds);
    return animalResponse.Responses.Animals;
  }
  
  async asyncGetUserInfo(args) {
    return await this.userData.getUserInfo(args);
  }
}

const handlerService = new HandlerService();

const data = {
  getPaginatedUserSites(handle, args) {
    return handlerService.asyncGetUserSite(handle, args).then(result => {
      return {
        items: result
      };
    }).catch(err => {
      console.log(err);
    });
  },
  getSiteAnimals(site_id, args) {
    return handlerService.asyncGetSiteAnimals(site_id, args).then(result => {
      return {
        items: result
      };
    }).catch(err => {
      console.log(err);
    });
  },
  getAnimal(args) {
    return handlerService.asyncGetAnimal(args.animal_id).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
  getSiteInfo(args) {
    return handlerService.asyncGetSiteInfo(args.site_id).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
  getUserInfo(args) {
    return handlerService.asyncGetUserInfo(args).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
  createUser(args) {
    return handlerService.asyncCreateUser(args).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
  updateUser(args) {
    return handlerService.asyncUpdateUser(args).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
  createSiteAndLink(args) {
    return handlerService.asyncCreateSite(args).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
  updateSite(args) {
    return handlerService.asyncUpdateSite(args).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
  createAnimal(args) {
    return handlerService.asyncCreateAnimal(args).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
  updateAnimal(args) {
    return handlerService.asyncUpdateAnimal(args).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
  removeSiteLink(args) {
    return handlerService.asyncRemoveSiteLink(args).then(result => {
      return result;
    }).catch(err => {
      console.log(err);
    });
  },
};

// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    getUserInfo: (_, args) => data.getUserInfo(args),
    getAnimal: (_, args) => data.getAnimal(args),
    getSiteInfo: (_, args) => data.getSiteInfo(args),
  },
  Mutation: {
    createUser: (_, args) => data.createUser(args),
    updateUser: (_, args) => data.updateUser(args),
    createAnimal: (_, args) => data.createAnimal(args),
    updateAnimal: (_, args) => data.updateAnimal(args),
    createSiteAndLink: (_, args) => data.createSiteAndLink(args),
    updateSite: (_, args) => data.updateSite(args),
    removeSiteLink: (_, args) => data.removeSiteLink(args),
  },
  User: {
    siteInfo: (obj, args) => data.getPaginatedUserSites(obj.handle, obj.site, args),
  },
  Site: {
    animals: (obj, args) => data.getSiteAnimals(obj.site_id, args),
  }
};