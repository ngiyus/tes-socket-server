const firebaseAdmin = require("firebase-admin");
const serviceAccountConfig = require("./config_firebase_admin.json");
const firebaseDynamicLinksConfig = require("./firebase_dynamic_links.json");
const fetch = require('request-promise-native');

const firebaseConn = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountConfig),
});

/**
 * @param {string} uid
 * @returns {Promise<string>}
 */
async function createDynamicLinks(uid) {
  let result = await fetch.post(
    `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${firebaseDynamicLinksConfig.apiKey}`,
    {
      json: true,
      body: {
          "dynamicLinkInfo": {
            "domainUriPrefix": firebaseDynamicLinksConfig.domainUriPrefix,
            "link": firebaseDynamicLinksConfig.link+uid,
            "androidInfo": {
              "androidPackageName": firebaseDynamicLinksConfig.androidInfo.androidPackageName
            },
            "socialMetaTagInfo": {
              "socialTitle": firebaseDynamicLinksConfig.socialMetaTagInfo.socialTitle,
              "socialDescription": firebaseDynamicLinksConfig.socialMetaTagInfo.socialDescription,
              "socialImageLink": firebaseDynamicLinksConfig.socialMetaTagInfo.socialImageLink
            }
          },
          "suffix": {
            "option": "SHORT"
          }
        }
  });

  return result.shortLink;
}

module.exports = {
  firebaseConn,
  createDynamicLinks,
};