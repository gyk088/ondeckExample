import "Images";
import Config from "./conf";

document.addEventListener("DOMContentLoaded", () => {
  console.info("version: ", Config.version)
  new Config.rootModule(Config)
});
