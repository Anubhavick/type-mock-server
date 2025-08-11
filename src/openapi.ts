import { Type } from 'ts-morph';

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
}

export function generateOpenAPISpec(
  routes: Record<string, string>,
  types: Record<string, Type>,
  port: number
): OpenAPISpec {
  const spec: OpenAPISpec = {
    openapi: '3.0.0',
    info: {
      title: 'Mock API',
      version: '1.0.0',
      description: 'Auto-generated mock API from TypeScript types'
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local mock server'
      }
    ],
    paths: {},
    components: {
      schemas: {}
    }
  };

  // Generate schemas from TypeScript types
  Object.entries(types).forEach(([typeName, type]) => {
    spec.components.schemas[typeName] = typeToOpenAPISchema(type);
  });

  // Generate paths from routes
  Object.entries(routes).forEach(([route, typeName]) => {
    const isArray = typeName.endsWith('[]');
    const baseType = typeName.replace(/\[\]$/, '');
    
    const pathItem = {
      get: {
        summary: `Get ${typeName}`,
        parameters: route.includes('/:') ? [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ] : [
          {
            name: 'count',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: isArray ? 3 : 1 }
          },
          {
            name: 'seed',
            in: 'query',
            required: false,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: isArray 
                  ? { type: 'array', items: { $ref: `#/components/schemas/${baseType}` } }
                  : { $ref: `#/components/schemas/${baseType}` }
              }
            }
          }
        }
      }
    };

    // Convert Express route to OpenAPI path
    const openApiPath = route.replace(/:(\w+)/g, '{$1}');
    spec.paths[openApiPath] = pathItem;
  });

  return spec;
}

function typeToOpenAPISchema(type: Type): any {
  if (type.isString()) return { type: 'string' };
  if (type.isNumber()) return { type: 'number' };
  if (type.isBoolean()) return { type: 'boolean' };
  if (type.isArray()) {
    return {
      type: 'array',
      items: typeToOpenAPISchema(type.getArrayElementTypeOrThrow())
    };
  }
  if (type.isEnum()) {
    return {
      type: 'string',
      enum: type.getUnionTypes().map(t => t.getLiteralValue())
    };
  }
  if (type.isObject() && type.getProperties().length) {
    const properties: Record<string, any> = {};
    const required: string[] = [];
    
    type.getProperties().forEach((prop) => {
      const name = prop.getName();
      const valueDecl = prop.getValueDeclaration();
      if (valueDecl) {
        const propType = prop.getTypeAtLocation(valueDecl);
        properties[name] = typeToOpenAPISchema(propType);
        
        // All properties are considered required for simplicity
        required.push(name);
      }
    });
    
    return {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined
    };
  }
  
  return { type: 'object' };
}
