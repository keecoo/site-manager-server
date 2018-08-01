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

faker.seed(1000);

handleNames.push('kgcoombs@gmail.com');
for (let i = 0; i < numUsers; i++) {
  const handle = faker.internet.userName();
  handleNames.push(handle);
}

for (let i = 0; i < numSites; i++) {
  siteData.push({
    site_id: faker.random.uuid(),
    site_name: faker.address.streetAddress(false),
    description: faker.lorem.sentence(10, 5),
    image_url: "https://www.w3schools.com/howto/img_forest.jpg" //faker.image.city(),
  });
}

for (let i = 0; i < numAnimals; i++) {
  animalData.push({
    animal_id: faker.random.uuid(),
    animal_name: faker.internet.userName(),
    description: faker.lorem.sentence(10, 5),
    image_url: faker.image.cats(),
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
    handle: handleNames[i],
    name: name,
    location: location,
    description: description,
    site: [siteData[0].site_id, siteData[1].site_id],
  };

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