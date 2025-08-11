import { Project, Type } from 'ts-morph';
import { faker } from '@faker-js/faker';

// Parses a TypeScript file and generates mock data for exported types
export function generateMockDataFromFile(filePath: string) {
  const project = new Project();
  project.addSourceFileAtPath(filePath);
  const sourceFile = project.getSourceFileOrThrow(filePath);
  const exportedTypes = sourceFile.getExportedDeclarations();
  const mocks: Record<string, any> = {};

  exportedTypes.forEach((decls, name) => {
    const decl = decls[0];
    if (decl && decl.getType) {
      mocks[name] = generateMockForType(decl.getType());
    }
  });
  return mocks;
}

function generateMockForType(type: Type): any {
  if (type.isString()) return faker.lorem.word();
  if (type.isNumber()) return faker.datatype.number();
  if (type.isBoolean()) return faker.datatype.boolean();
  if (type.isArray()) return [generateMockForType(type.getArrayElementTypeOrThrow())];
  if (type.isObject() && type.getProperties().length) {
    const obj: Record<string, any> = {};
    type.getProperties().forEach((prop) => {
      const propType = prop.getTypeAtLocation(prop.getValueDeclarationOrThrow());
      obj[prop.getName()] = generateMockForType(propType);
    });
    return obj;
  }
  return null;
}
