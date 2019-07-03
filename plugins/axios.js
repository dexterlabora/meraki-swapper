import * as axios from "axios";

let options = {};
// The server-side needs a full url to works
let path =
  window.location.protocol +
  "//" +
  location.hostname +
  (location.port ? ":" + location.port : "");
options.baseURL = path;
/*
if (process.server) {
  //options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`
  options.baseURL = window.location.href;
}
*/

export default axios.create(options);
