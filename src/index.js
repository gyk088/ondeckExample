import 'Images';
import Config from './conf';

document.addEventListener('DOMContentLoaded', () => {
  console.info('version: ', Config.version);
  // eslint-disable-next-line
  new Config.rootModule(Config);
});
