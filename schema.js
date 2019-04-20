import { gql } from 'apollo-server-lambda';
const schema = gql`
type Mutation {
    createUser(
        name: String!
        handle: String!
      ): User

    updateUser(
        first_name: String!
        last_name: String!
        handle: String!
        phone: String
      ): User

    createSite(
        site_name: String!
        description: String!
    ): Site

    createSiteAndLink(
        site_name: String!
        description: String!
        handle: String!
    ): Site
}

type Query {
    meInfo(consumer_key: String, consumer_secret: String): User!
    getUserInfo(handle: String!, consumer_key: String, consumer_secret: String): User!

    getAnimal(animal_id: String!): Animal!
    getSiteInfo(site_id: String!): Site!
}

type GeoPosition {
    latitude: Float!
    longitude: Float!
    latitudeDelta: Float!
    longitudeDelta: Float!
}

input TokenInput {
    created_at: String!
    handle: String!
}

type Token {
    created_at: String!
    handle: String!
}

type User {
    user_id: String!
    name: String!
    first_name: String
    last_name: String
    phone: String
    handle: String!
    site: [String!]

    siteInfo(limit: Int, nextToken: TokenInput): SiteList
}

type Animal {
    animal_id: String!
    animal_name: String!
    description: String!
    image_url: String!
    sex: String!
    breed: String!
    vaccinations: [String!]
    status: String!
    status_date: String!
}

type AnimalList {
    items: [Animal!]!
    nextToken: Token
}

type Site {
    site_id: String!
    description: String!
    location: GeoPosition!
    site_name: String!
    image_url: String!
    address: String!
    city: String!
    state: String!
    zip: String!

    animals(limit : Int, nextToken: TokenInput) : AnimalList
}

type SiteList {
    items: [Site!]!
    nextToken: Token
}

schema {
    query: Query
    mutation: Mutation
}`;

// eslint-disable-next-line import/prefer-default-export
export {
    schema
};