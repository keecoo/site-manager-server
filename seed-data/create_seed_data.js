const faker = require('faker');
const jsonfile = require('jsonfile');
const uuidv1 = require('uuid/v1');

const numUsers = 10;
const numSites = 10;
const numAnimals = 10;

const udata = [];
const siteData = [];
const animalData = [];
const animalSiteData = [];
const handleNames = [];
const userIds = [];

faker.seed(1000);

handleNames.push('kgcoombs@gmail.com');
userIds.push('auth0|5b5b901d750f272b79318cb8')
for (let i = 0; i < numUsers; i++) {
  const handle = faker.internet.userName();
  handleNames.push(handle);
  userIds.push(faker.random.uuid())
}

for (let i = 0; i < numSites; i++) {
  siteData.push({
    site_id: faker.random.uuid(),
    site_name: faker.address.streetAddress(false),
    description: faker.lorem.sentence(10, 5),
    location: {
      latitude: 41.0833976,
      longitude: -112.0532486,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    },
    image_url: "https://www.w3schools.com/howto/img_forest.jpg" //faker.image.city(),
  });
}

for (let i = 0; i < numAnimals; i++) {
  animalData.push({
    animal_id: faker.random.uuid(),
    animal_name: faker.internet.userName(),
    description: faker.lorem.sentence(10, 5),
    image_url: faker.image.cats(),
    breed: faker.internet.userName(),
    sex: 'M',
    vaccinations: [],
    status: "PRESENT",
    status_date: faker.date.past(1)
  });
}

for (let i = 0; i < numAnimals; i++) {
  animalSiteData.push({
    animal_site_id: faker.random.uuid(),
    site_id: siteData[i].site_id,
    animal_id: animalData[i].animal_id,
    created_at: faker.date.between('2016-01-01', '2017-01-27'),
  });
}

for (let i = 0; i < handleNames.length; i++) {
  const following = [];

  //create user info
  const name = faker.name.findName();
  const location = faker.address.city();
  const description = faker.name.jobTitle();

  const userInfo = {
    user_id: userIds[i],
    handle: handleNames[i],
    name: name,
    location: location,
    description: description,
    site: {},
    created_at: faker.date.between('2016-01-01', '2017-01-27'),
  };
  userInfo.site = {};
  userInfo.site[siteData[0].site_id] = { site_id : siteData[0].site_id}
  userInfo.site[siteData[1].site_id] = { site_id : siteData[1].site_id}
  udata.push(userInfo);
}

const animalFile = 'Animals.json';
const animalSiteFile = 'AnimalSites.json';
const ufile = 'Users.json';
const sitefile = 'Sites.json';

jsonfile.writeFileSync(ufile, udata, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('data created successfully');
  }
});

jsonfile.writeFileSync(sitefile, siteData, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('data created successfully');
  }
});

jsonfile.writeFileSync(animalFile, animalData, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('data created successfully');
  }
});

jsonfile.writeFileSync(animalSiteFile, animalSiteData, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('data created successfully');
  }
});