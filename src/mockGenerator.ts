
import { faker } from '@faker-js/faker';
import { Type, Symbol as MorphSymbol } from 'ts-morph';

// Smart field-based mock generation
const fieldGenerators: Record<string, () => any> = {
  id: () => faker.datatype.number({ min: 1, max: 1000 }),
  name: () => faker.person.fullName(),
  firstName: () => faker.person.firstName(),
  lastName: () => faker.person.lastName(),
  email: () => faker.internet.email(),
  username: () => faker.internet.userName(),
  password: () => faker.internet.password(),
  phone: () => faker.phone.number(),
  avatar: () => faker.image.avatar(),
  url: () => faker.internet.url(),
  title: () => faker.lorem.sentence(),
  content: () => faker.lorem.paragraphs(3),
  description: () => faker.lorem.paragraph(),
  createdAt: () => faker.date.past(),
  updatedAt: () => faker.date.recent(),
  publishedAt: () => faker.date.past(),
  price: () => faker.commerce.price(),
  address: () => faker.location.streetAddress(),
  city: () => faker.location.city(),
  country: () => faker.location.country(),
  zipCode: () => faker.location.zipCode(),
  company: () => faker.company.name(),
  tags: () => faker.lorem.words(3).split(' ')
};

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
      
      // Use smart field generators if available
      if (fieldGenerators[name]) {
        obj[name] = fieldGenerators[name]();
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
