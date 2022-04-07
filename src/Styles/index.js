import { StyleSchema } from './schema';
import { getStyle } from './utils';

export function makeStyleSchema({ available_colors }) {
  const schema = StyleSchema();
  schema.properties.backgroundColor.available_colors = available_colors;
  return schema;
}

export { getStyle };
