#!/usr/bin/env node
import { Command } from 'commander';
import { startServer } from './server';

const program = new Command();

program
  .name('mock-server')
  .description('Type-driven mock API generator')
  .version('0.1.0');

program
  .command('start')
  .description('Start the mock server')
  .action(() => {
    startServer();
  });

program.parse(process.argv);
