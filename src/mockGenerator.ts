import { faker } from '@faker-js/faker';
import { Type } from 'ts-morph';

export function generateMock(type: Type): any {
  if (type.isString()) return faker.lorem.word();
  if (type.isNumber()) return faker.datatype.number();
  if (type.isBoolean()) return faker.datatype.boolean();
  if (type.isArray()) return [generateMock(type.getArrayElementTypeOrThrow())];
  if (type.isObject()) {
    const props: any = {};
    type.getProperties().forEach((prop) => {
      const propType = prop.getTypeAtLocation(prop.getValueDeclarationOrThrow());
      props[prop.getName()] = generateMock(propType);
    });
    return props;
  }
  return null;
}
