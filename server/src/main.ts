import chalk from 'chalk';
import { startWebserver } from './webserver/runner.js';
import * as webserverConfig from './config/webserver.js';

await startWebserver();
console.log(`Webserver is listening on port ${chalk.yellow(webserverConfig.port)}`);