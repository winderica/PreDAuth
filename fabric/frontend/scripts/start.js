process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
    throw err;
});

require('../config/env');

const fs = require('fs');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
    choosePort,
    createCompiler,
    prepareProxy,
    prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
}

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0';

const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
    .then(() => {
        return choosePort(HOST, DEFAULT_PORT);
    })
    .then(port => {
        if (port == null) {
            return;
        }

        const config = configFactory('development');
        const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
        const appName = require(paths.appPackageJson).name;
        const urls = prepareUrls(
            protocol,
            HOST,
            port,
            paths.publicUrlOrPath.slice(0, -1)
        );
        const devSocket = {
            warnings: warnings => devServer.sockWrite(devServer.sockets, 'warnings', warnings),
            errors: errors => devServer.sockWrite(devServer.sockets, 'errors', errors),
        };
        const compiler = createCompiler({
            appName,
            config,
            devSocket,
            urls,
            useYarn,
            webpack,
        });
        const proxySetting = require(paths.appPackageJson).proxy;
        const proxyConfig = prepareProxy(
            proxySetting,
            paths.appPublic,
            paths.publicUrlOrPath
        );
        const serverConfig = createDevServerConfig(
            proxyConfig,
            urls.lanUrlForConfig
        );
        const devServer = new WebpackDevServer(compiler, serverConfig);
        devServer.listen(port, HOST, err => {
            if (err) {
                return console.log(err);
            }
            if (isInteractive) {
                clearConsole();
            }

            console.log(chalk.cyan('Starting the development server...\n'));
            openBrowser(urls.localUrlForBrowser);
        });

        ['SIGINT', 'SIGTERM'].forEach(sig => {
            process.on(sig, () => {
                devServer.close();
                process.exit();
            });
        });

        if (isInteractive || process.env.CI !== 'true') {
            process.stdin.on('end', () => {
                devServer.close();
                process.exit();
            });
            process.stdin.resume();
        }
    })
    .catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }
        process.exit(1);
    });
