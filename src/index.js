import "Images";
import Config from "./conf";
import Cookies from "js-cookie";

document.addEventListener("DOMContentLoaded", () => {
  let token = Cookies.get("token");

  console.info("version: ", VERSION);

  if (token) {
    new Config.modules["root"].class(Config);
  } else {
    new Config.modules["auth"].class(Config);
  }
});
