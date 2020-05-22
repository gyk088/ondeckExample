import "Images";
import Config from "./conf";

document.addEventListener("DOMContentLoaded", () => {
  console.info("version: ", VERSION);
  new Config.rootModule(Config);
});
