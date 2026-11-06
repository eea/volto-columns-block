import { StyleSchema } from './schema';
import { getStyle } from './utils';

export function makeStyleSchema({ available_colors }, intl) {
  const schema = StyleSchema(intl);
  schema.properties.backgroundColor.available_colors = available_colors;
  return schema;
}

export { getStyle };
