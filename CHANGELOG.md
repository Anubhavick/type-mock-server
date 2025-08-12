# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-08-11

### Removed
- 🧹 Removed unused `mockDataGenerator.ts` file
- 🧹 Removed duplicate `faker` dependency (keeping `@faker-js/faker`)
- 🧹 Removed Python virtual environment files
- 🧹 Cleaned up .DS_Store files

### Changed
- 📝 Updated .gitignore to exclude Python files and .venv directory
- 📦 Reduced package size by removing unused dependencies

## [1.0.0] - 2025-08-11

### Added
- 🚀 Initial release of Type Mock Server
- ⚡ Zero-config TypeScript type-driven mock API generation
- 🎯 Smart mock data generation based on field names and types
- 🔄 Hot reload functionality with file watching
- 📖 Built-in Swagger UI and OpenAPI spec generation
- 🛡️ Rate limiting and request validation middleware
- 🎨 Customizable mock data with override support
- 📚 Project initialization with example templates (basic, ecommerce)
- 🎲 Query parameter support (count, seed) for consistent data
- 💚 Health check endpoints and comprehensive error handling
- 🛠️ Full CLI with commands: start, reload, init, examples, config, endpoints
- 📄 Support for TypeScript interfaces, enums, unions, arrays, and nested objects
- 🌐 CORS support and Express.js-based server
- 📦 Professional package setup with proper metadata and documentation

### Features
- Type parsing from TypeScript files using ts-morph
- Realistic mock data generation with Faker.js
- Express server with middleware stack
- CLI aliases: `type-mock-server` and `tms`
- Multiple HTTP methods (GET, POST) support
- Automatic endpoint generation from configuration
- Built-in documentation at `/docs` and `/openapi.json`
- File watching for development workflow
- Example project templates for quick start