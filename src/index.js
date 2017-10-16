#!/usr/bin/env node
import 'babel-polyfill'
import { version } from '../package.json'
import program from 'commander'
import configureCommand from './commands/configure'
import syncCommand from './commands/sync'

program
.version(version)
.description('Toggl to Harvest Syncer')

configureCommand(program)
syncCommand(program)

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
