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





