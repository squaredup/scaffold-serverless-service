#!/usr/bin/env node
const yargs = require('yargs');
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
const Scaffold = async () => {
    // Get name from arguments
    const name = (process.argv[2] || '').toLowerCase();

    // Create the service using template
    const template = path.resolve(__dirname, "template");
    exec(`serverless create --template-path "${template}" --name ${name}`, {stdio:[0, 1, 2]});

    // Replace tokens in package.json
    const packagePath = path.resolve(process.cwd(), name, "package.json");
    const package = await util.promisify(fs.readFile)(packagePath, 'utf8');
    const result = package.replace(/__SERVICE_NAME__/g, name);
    await util.promisify(fs.writeFile)(packagePath, result, 'utf8');

    log.ok(`Created new service at ${chalk.green.underline.bold(`${name}/serverless.yml`)}`);
}

yargs
    .scriptName('scaffold-service')
    .command(
        '$0 [name]', 
        chalk.green.bold('Scaffold a Serverless Framework service'), 
        (y) => {
            y.example('$0', 'new-service');
        }, 
        (argv) => {
            return Scaffold(argv.name).then(() => {
                log.info(chalk.bold("Scaffolding complete!"))
            })
            .catch(ex => {                               
                log.err(ex);
            });
    })
    .option('name', {
        alias: 'n',
        type: 'string',
        description: chalk.blue('The name of the service to scaffold'),
        demandOption: true
    })
    .wrap(yargs.terminalWidth())   
    .help()
    .argv;