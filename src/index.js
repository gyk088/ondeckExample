import 'Images';
import Config from './conf';

console.info('version: ', Config.version);
// eslint-disable-next-line
new Config.rootModule(Config);