import { GraphQLScalarType, Kind } from 'graphql';

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO 8601',
  parseValue(value: any): Date {
    if (typeof value === 'string') {
      return new Date(value); 
    }
    throw new Error('Invalid date format');
  },
  serialize(value: any): string {

    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error('Value is not a valid Date');
  },
  parseLiteral(ast): Date | null {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export default DateTime;