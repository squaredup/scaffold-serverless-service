#!/usr/bin/env node
const yargs = require('yargs');
const chalk = require('chalk');
const log = require('./log.js');
const core = require('./core.js');

/**
 * CLI
 */

yargs
    .scriptName('scaffold-service')
    .command(
        '$0 [name]', 
        chalk.green.bold('Scaffold a Serverless Framework service'), 
        (y) => {
            y.example('$0', 'new-service');
        }, 
        (argv) => {
            return core.Scaffold(argv.name).then(() => {
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