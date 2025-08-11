
import { faker } from '@faker-js/faker';
import { Type, Symbol as MorphSymbol } from 'ts-morph';

// Optionally pass custom overrides for specific fields
export function generateMock(type: Type, overrides: Record<string, any> = {}): any {
  if (type.isString()) return faker.lorem.words();
  if (type.isNumber()) return faker.datatype.number({ min: 1, max: 1000 });
  if (type.isBoolean()) return faker.datatype.boolean();
  if (type.isEnum()) {
    const enumValues = type.getUnionTypes().map(t => t.getLiteralValue());
    return faker.helpers.arrayElement(enumValues);
  }
  if (type.isUnion()) {
    const unionTypes = type.getUnionTypes();
    return generateMock(faker.helpers.arrayElement(unionTypes), overrides);
  }
  if (type.isArray()) {
    const arrType = type.getArrayElementTypeOrThrow();
    return Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () => generateMock(arrType, overrides));
  }
  if (type.isObject() && type.getProperties().length) {
    const obj: Record<string, any> = {};
    type.getProperties().forEach((prop) => {
      const name = prop.getName();
      if (overrides[name] !== undefined) {
        obj[name] = overrides[name];
        return;
      }
      const valueDecl = prop.getValueDeclaration();
      if (valueDecl) {
        const propType = prop.getTypeAtLocation(valueDecl);
        obj[name] = generateMock(propType, overrides[name] || {});
      }
    });
    return obj;
  }
  return null;
}
