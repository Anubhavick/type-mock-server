#!/usr/bin/env node
import { Command } from 'commander';
import { startServer } from './server';
import { examples, generateExample } from './examples';

const program = new Command();

program
  .name('type-mock-server')
  .description('Type-driven mock API generator')
  .version('1.0.2');

program
  .command('start')
  .description('Start the mock server')
  .option('-p, --port <port>', 'Port to run the server on')
  .option('-c, --config <config>', 'Path to config file')
  .action((options) => {
    if (options.port) {
      process.env.PORT = options.port;
    }
    if (options.config) {
      process.env.CONFIG_PATH = options.config;
    }
    startServer();
  });

program
  .command('init')
  .description('Initialize a new mock server project')
  .argument('[name]', 'Project name', 'my-mock-api')
  .option('-e, --example <example>', 'Use an example template', 'basic')
  .action((name, options) => {
    const exampleName = options.example;
    if (!examples[exampleName]) {
      console.error(`❌ Example '${exampleName}' not found.`);
      console.log(`Available examples: ${Object.keys(examples).join(', ')}`);
      process.exit(1);
    }
    
    generateExample(exampleName, name);
  });

program
  .command('examples')
  .description('List available example templates')
  .action(() => {
    console.log('📚 Available example templates:\n');
    Object.entries(examples).forEach(([key, example]) => {
      console.log(`  ${key.padEnd(15)} - ${example.name}`);
      console.log(`  ${' '.repeat(15)}   ${example.description}\n`);
    });
    console.log('Usage: type-mock-server init my-project --example <name>');
  });

program
  .command('reload')
  .description('Start server with hot reload on file changes')
  .action(() => {
    const chokidar = require('chokidar');
    let serverInstance: any;
    
    function restart() {
      if (serverInstance && serverInstance.close) {
        console.log('🔄 Restarting server...');
        serverInstance.close();
      }
      serverInstance = startServer();
    }
    
    const configPath = require('path').resolve(process.cwd(), 'mock-server.config.ts');
    const schemaPath = require('path').resolve(process.cwd(), 'src/types');
    
    const watcher = chokidar.watch([configPath, schemaPath], { 
      ignoreInitial: true,
      ignored: /node_modules/
    });
    
    watcher.on('all', (event: string, path: string) => {
      console.log(`📁 File ${event}: ${path}`);
      restart();
    });
    
    console.log('👀 Watching for file changes...');
    restart();
  });

program
  .command('config')
  .description('Show the current mock server configuration')
  .action(() => {
    try {
      const { loadConfig } = require('./config');
      const config = loadConfig();
      console.log('📋 Current configuration:');
      console.log(JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('❌ Failed to load config:', error instanceof Error ? error.message : error);
    }
  });

program
  .command('endpoints')
  .description('List all available mock API endpoints')
  .action(() => {
    try {
      const { loadConfig } = require('./config');
      const config = loadConfig();
      console.log('🎯 Available endpoints:\n');
      Object.entries(config.routes).forEach(([route, type]) => {
        console.log(`  ${route.padEnd(25)} -> ${type}`);
      });
      console.log(`\n🌐 Server will run on: http://localhost:${config.port}`);
    } catch (error) {
      console.error('❌ Failed to load config:', error instanceof Error ? error.message : error);
    }
  });

program.parse(process.argv);
