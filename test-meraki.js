//import meraki from "meraki";
const meraki = require("meraki");
meraki.Configuration.BASEURI = "http://localhost:3000/api";
meraki.Configuration.xCiscoMerakiAPIKey = "";

meraki.OrganizationsController.getOrganizations()
  .then(res => console.log("organizations", res))
  .catch(e => console.log("error: ", e));
