import AnimalData from './data/animal';
import { UpdateAnimalArgs, CreateAnimalArgs } from './data/animal';
import AnimalSiteData from './data/animal_site';
import SiteData  from './data/site';
import { CreateSiteArgs, UpdateSiteArgs }  from './data/site';
import UserData, { GetUserInfoArgs } from './data/user';
import { CreateUserArgs, UpdateUserArgs, RemoveSiteArgs, LinkSiteArgs } from './data/user';


export default class HandlerService {
  userData: UserData;
  animalData: AnimalData;
  siteData: SiteData;
  animalSiteData: AnimalSiteData;
  constructor() {
    this.userData = new UserData();
    this.animalData = new AnimalData();
    this.siteData = new SiteData();
    this.animalSiteData = new AnimalSiteData();    
  }
  
  async asyncGetAnimal(animal_id : string) {
    return await this.animalData.getAnimalData(animal_id);    
  }

  async asyncCreateAnimal(args : CreateAnimalArgs) {
    return await this.animalData.createAnimal(args);
  }
  
  isUpdate(pet: UpdateAnimalArgs): pet is UpdateAnimalArgs { //magic happens here
    return (<UpdateAnimalArgs>pet) !== undefined;
  }

  async asyncUpdateAnimal(args : UpdateAnimalArgs) {
    if (this.isUpdate(args)) {
      console.log('is update animal')
    }
    return await this.animalData.updateAnimal(args);
  }
  
  async asyncGetSiteInfo(site_id : string) {
    return await this.siteData.getSiteData(site_id);
  }
  
  async asyncCreateSite(args : CreateSiteArgs) {
    const site = await this.siteData.createSite(args);
    await this.userData.linkSite({
      handle: args.handle,
      site_id: site.site_id
    });
    return site;
  }
  
  async asyncUpdateSite(args : UpdateSiteArgs) {
    const site = await this.siteData.updateSite(args);
    return site;
  }
  
  async asyncRemoveSiteLink(args : RemoveSiteArgs) {
    await this.userData.removeSite({
      handle: args.handle,
      site_id: args.site_id
    });
    return await this.userData.getUserInfo(args);
  }
  
  async asyncGetUserSite(handle, siteList) {
    const sites : any = await this.siteData.getSitesData(siteList);
    return sites.Responses.Sites;
  }
  
  async asyncCreateUser(args : CreateUserArgs) {
    return await this.userData.createUser(args);
  }
  
  async asyncUpdateUser(args : UpdateUserArgs) {
    return await this.userData.updateUser(args);
  }
  
  async asyncGetSiteAnimals(site_id : string) {
    const items = await this.animalSiteData.getAnimalSiteDataBySiteIDs(site_id);
    if (items.length === 0) {
      return [];
    }
    const animalIds = items.map(s => s.animal_id);
    const animalResponse = await this.animalData.getAnimalsByAnimalIds(animalIds);
    return animalResponse;
  }
  
  async asyncGetUserInfo(args : GetUserInfoArgs) {
    return await this.userData.getUserInfo(args);
  }
}
