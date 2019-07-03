import meraki from "meraki";
meraki.Configuration.xCiscoMerakiAPIKey = ""; // Removing default Demo Key
// works but client-side (api key is visible)
/*
meraki.Configuration.xCiscoMerakiAPIKey = configs.apiKey;
meraki.Configuration.BASEURI = "https://n149.meraki.com/api/v0";
*/
let path =
  window.location.protocol +
  "//" +
  location.hostname +
  (location.port ? ":" + location.port : "");

meraki.Configuration.BASEURI = path + "/api";

export default meraki;
