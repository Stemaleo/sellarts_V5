export const SEND_COUNTRY_ID = `
 mutation featureUpdateUserCountry($user: ID!, $country: ID!) {
  featureUpdateUserCountry(user: $user, country: $country) {
    user {
      email
      name
      country{
        id
        name
      }
    }
    success
    message
  }
}
`;
