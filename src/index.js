#!/usr/bin/env node
import { version } from '../package.json'
import program from 'commander'
import configure from './commands/configure'

program
.version(version)
.description('Toggl to Harvest Syncer')

configure.setup(program)

program.parse(process.argv)
