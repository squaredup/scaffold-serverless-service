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
    const folder = `${nameLower}-service`;
    exec(`serverless create --template-path "${template}" --name ${nameLower} --path ${folder}`, {stdio:[0, 1, 2]});

    // Replace tokens in package.json
    const packagePath = path.resolve(process.cwd(), folder, "package.json");
    const package = await util.promisify(fs.readFile)(packagePath, 'utf8');
    const packageReplaced = package.replace(/__SERVICE_NAME__/g, nameLower);
    await util.promisify(fs.writeFile)(packagePath, packageReplaced, 'utf8');

    // Replace tokens in serverless.yml
    const slsPath = path.resolve(process.cwd(), folder, "serverless.yml");
    const sls = await util.promisify(fs.readFile)(slsPath, 'utf8');
    const slsReplaced = sls.replace(/__SERVICE_NAME__/g, nameLower);
    await util.promisify(fs.writeFile)(slsPath, slsReplaced, 'utf8');

    log.ok(`Created new service at ${chalk.green.underline.bold(`${folder}/serverless.yml`)}`);

    return path.resolve(process.cwd(), folder, "serverless.yml");
}

module.exports = { Scaffold };