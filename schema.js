"use strict";
import { gql } from 'apollo-server-lambda';
const schema = gql`
type Mutation {
    createAnimal(
        animal_name: String!
        description: String
        image_url: String
        sex: String
        breed: String
        vaccinations: [String!]
        status: String
        status_date: String
      ): Animal

    updateAnimal(
        animal_id: String!
        animal_name: String!
        description: String
        image_url: String
        sex: String
        breed: String
        vaccinations: [String!]
        status: String
        status_date: String
      ): Animal

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

    createSiteAndLink(
        site_name: String!
        description: String!
        handle: String!
    ): Site

    updateSite(
        site_id: String!
        site_name: String!
        description: String!
        image_url: String!
    ): Site

    removeSiteLink(
        site_id: String!
        handle: String!
    ) : User!
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
    site: [SmallSite!]

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

type SmallSite {
    site_id: String!
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