const chalk = require('chalk');
const exec = require('child_process').execSync;
const path = require('path');
const util = require('util');
const fs = require('fs');
const log = require('./log.js');

/**
 * Creates a service using the template in the ./template folder
 * Also replaces placeholders in package.json etc.
 */
const Scaffold = async (name) => {
    const nameLower = name.toLowerCase();

    // Create the service using template
    const template = path.resolve(__dirname, "template");
    exec(`serverless create --template-path "${template}" --name ${nameLower}`, {stdio:[0, 1, 2]});

    // Replace tokens in package.json
    const packagePath = path.resolve(process.cwd(), nameLower, "package.json");
    const package = await util.promisify(fs.readFile)(packagePath, 'utf8');
    const result = package.replace(/__SERVICE_NAME__/g, nameLower);
    await util.promisify(fs.writeFile)(packagePath, result, 'utf8');

    log.ok(`Created new service at ${chalk.green.underline.bold(`${nameLower}/serverless.yml`)}`);

    return path.resolve(process.cwd(), nameLower, "serverless.yml");
}

module.exports = { Scaffold };