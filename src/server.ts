import express from 'express';
import cors from 'cors';
import { loadConfig } from './config';
import { parseTypes } from './schemaParser';
import { generateMock } from './mockGenerator';
import { generateOpenAPISpec } from './openapi';
import { rateLimit, validateRequest, responseTime } from './middleware';

export function startServer() {
  const config = loadConfig();
  const types = parseTypes(config.schema);
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(rateLimit(100, 60000)); // 100 requests per minute
  app.use(validateRequest);
  app.use(responseTime);
  
  // Add request logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // OpenAPI spec endpoint
  app.get('/openapi.json', (req, res) => {
    const spec = generateOpenAPISpec(config.routes, types, config.port);
    res.json(spec);
  });

  // Swagger UI endpoint
  app.get('/docs', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mock API Documentation</title>
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui.css" />
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-bundle.js"></script>
          <script>
            SwaggerUIBundle({
              url: '/openapi.json',
              dom_id: '#swagger-ui',
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.presets.standalone
              ]
            });
          </script>
        </body>
      </html>
    `);
  });

  // API documentation endpoint
  app.get('/api-docs', (req, res) => {
    const docs = {
      title: 'Mock API Documentation',
      endpoints: Object.entries(config.routes).map(([route, typeName]) => ({
        path: route,
        method: 'GET',
        returns: typeName,
        example: `http://localhost:${config.port}${route}`
      }))
    };
    res.json(docs);
  });

  // Generate mock endpoints
  Object.entries(config.routes).forEach(([route, typeName]) => {
    // Support both GET and POST for flexibility
    ['get', 'post'].forEach(method => {
      app[method as 'get' | 'post'](route, (req, res) => {
        const baseTypeName = typeName.replace(/\[\]$/, '');
        const type = types[baseTypeName];
        
        if (!type) {
          return res.status(404).json({ 
            error: 'Type not found', 
            type: baseTypeName,
            availableTypes: Object.keys(types)
          });
        }

        try {
          // Support query parameters for controlling mock data
          const count = parseInt(req.query.count as string) || (typeName.endsWith('[]') ? 3 : 1);
          const seed = req.query.seed as string;
          
          if (seed) {
            // Use seed for consistent data
            require('@faker-js/faker').faker.seed(parseInt(seed) || seed.length);
          }

          const mock = typeName.endsWith('[]')
            ? Array.from({ length: count }, () => generateMock(type))
            : generateMock(type);

          // Wrap in ApiResponse if the type exists
          if (types['ApiResponse']) {
            const wrappedResponse = generateMock(types['ApiResponse']);
            wrappedResponse.data = mock;
            wrappedResponse.success = true;
            wrappedResponse.message = 'Mock data generated successfully';
            wrappedResponse.timestamp = new Date();
            res.json(wrappedResponse);
          } else {
            res.json(mock);
          }
        } catch (error) {
          res.status(500).json({ 
            error: 'Failed to generate mock data', 
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ 
      error: 'Endpoint not found',
      suggestion: `Visit /api-docs to see available endpoints`,
      availableRoutes: Object.keys(config.routes)
    });
  });

  const server = app.listen(config.port, () => {
    console.log(`🚀 Mock server running at http://localhost:${config.port}`);
    console.log(`📖 Swagger UI at http://localhost:${config.port}/docs`);
    console.log(`📋 OpenAPI spec at http://localhost:${config.port}/openapi.json`);
    console.log(`💚 Health check at http://localhost:${config.port}/health`);
    console.log(`\n🎯 Available endpoints:`);
    Object.entries(config.routes).forEach(([route, type]) => {
      console.log(`   ${route} -> ${type}`);
    });
  });

  return server;
}
