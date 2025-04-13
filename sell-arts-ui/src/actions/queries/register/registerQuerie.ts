export const GET_COUNTRY_REGISTER = `
  query RegisterCountry {
    country(code_In: "CI, SN, ZA, NG, BJ, GH ", isDeleted: false, orderBy: "name") {
      edges {
        node {
          id
          name
          code
        }
      }
    }
  }
`;

export const GET_ALL_COUNTRY = `
query getAllDeliverableCountry {
  country(isDeleted: false orderBy:"name") {
    edges {
      node {
        id
        name
        code
      }
    }
  }
}
`;

export const GET_LOCATION = `
query SearchLocation($location: String!) {
  searchLocations(location: $location) {
    streetLine1
    streetLine2
    city
    state
    zip
    country
  }
}
`;






