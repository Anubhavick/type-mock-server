import express from 'express';
import { loadConfig } from './config';
import { parseTypes } from './schemaParser';
import { generateMock } from './mockGenerator';

export function startServer() {
  const config = loadConfig();
  const types = parseTypes(config.schema);
  const app = express();

  Object.entries(config.routes).forEach(([route, typeName]) => {
    app.get(route, (req, res) => {
      const type = types[typeName.replace(/\[\]$/, '')];
      if (!type) return res.status(404).send('Type not found');
      const mock = typeName.endsWith('[]')
        ? [generateMock(type)]
        : generateMock(type);
      res.json(mock);
    });
  });

  app.listen(config.port, () => {
    console.log(`Mock server running at http://localhost:${config.port}`);
  });
}
