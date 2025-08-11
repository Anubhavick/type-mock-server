import { Project, Type } from 'ts-morph';

export function parseTypes(schemaPath: string) {
  const project = new Project();
  project.addSourceFileAtPath(schemaPath);
  const sourceFile = project.getSourceFileOrThrow(schemaPath);
  const types: Record<string, Type> = {};
  sourceFile.getInterfaces().forEach((iface) => {
    types[iface.getName()] = iface.getType();
  });
  sourceFile.getTypeAliases().forEach((alias) => {
    types[alias.getName()] = alias.getType();
  });
  return types;
}
