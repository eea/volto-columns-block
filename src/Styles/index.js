import { StyleSchema } from './schema';

export function makeStyleSchema({ available_colors }) {
  const schema = StyleSchema();
  schema.properties.backgroundColor.available_colors = available_colors;
  return schema;
}

export function getStyle(props) {
  return {
    verticalAlign: props.grid_vertical_align,
    style: {
      backgroundColor: props.backgroundColor,
    },
  };
}
