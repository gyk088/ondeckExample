import 'Images';
import ExampleRoot from 'ExampleRoot/root';
import Config from './conf';

console.info('version: ', Config.version);
// eslint-disable-next-line
new ExampleRoot(Config);