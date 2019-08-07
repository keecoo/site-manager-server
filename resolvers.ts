import HandlerService from './handler_service'

const handlerService = new HandlerService();

//figure out how to make this a simpler action handler
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
    return handlerService.asyncGetSiteAnimals(site_id).then(result => {
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
    //getUserInfo: (_, args) => data.getUserInfo(args),
    getUserInfo: (_, args, ctx) => data.getUserInfo( { user_id: args.user_id}),
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
    siteInfo: (obj, args) => data.getPaginatedUserSites(obj.handle, obj.site),
  },
  Site: {
    animals: (obj, args) => data.getSiteAnimals(obj.site_id, args),
  }
};