#!/usr/bin/env node
const exec = require('child_process').execSync;
const path = require('path');
const util = require('util');
const fs = require('fs');

/**
 * Creates a service using the template in the ./template folder
 * Also replaces placeholders in package.json etc.
 */
const run = async () => {
    // Get name from arguments
    const name = (process.argv[2] || '').toLowerCase();

    // Create the service using template
    exec('serverless create --template-path "./template" --name ' + name, {stdio:[0, 1, 2]});

    // Replace tokens in package.json
    const packagePath = path.resolve(process.cwd(), name, "package.json");
    const package = await util.promisify(fs.readFile)(packagePath, 'utf8');
    const result = package.replace(/__SERVICE_NAME__/g, name);
    await util.promisify(fs.writeFile)(packagePath, result, 'utf8');

    // Done!
    console.log("The service was created succesfully.");
}

run();