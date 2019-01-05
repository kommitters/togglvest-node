#!/usr/bin/env node
const { version, description } = require('./package.json')
const program = require('commander')
const configureCommand = require('./lib/commands/configure')
const syncCommand = require('./lib/commands/sync')

program
  .version(version)
  .description(description)

configureCommand(program)
syncCommand(program)

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
