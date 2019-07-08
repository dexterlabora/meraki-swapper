//import meraki from "meraki";
const meraki = require("meraki");
meraki.Configuration.BASEURI = "https://api-mp.meraki.com/api/v0";
//meraki.Configuration.xCiscoMerakiAPIKey = "";

const myOrgs = [{ name: "myOrg", extraInfo: "foo" }];
meraki.OrganizationsController.getOrganizations()
  .then(res => {
    orgs = res;
    let mergedOrgs = [...orgs, ...myOrgs];
    let mergedOrg = { ...orgs[0], ...myOrgs[0] };
    console.log("organizations", orgs);
    console.log("mergedOrgs, ", mergedOrgs);
    console.log("mergedOrg", mergedOrg);
  })
  .catch(e => console.log("error: ", e));

let a = 1;

let b = 1 + a;
