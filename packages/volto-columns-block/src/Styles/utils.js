const getSide = (side, v) => {
  const v_unit = v.unit ? v.unit : 'px';
  return `${v?.[side] ? `${v[side]}${v_unit}` : '0'}`;
};

const getSides = (v) => {
  if (!v) return null;
  return `${getSide('top', v)} ${getSide('right', v)} ${getSide(
    'bottom',
    v,
  )} ${getSide('left', v)}`;
};

export function getStyle(props) {
  return {
    verticalAlign: props.grid_vertical_align,
    style: {
      backgroundColor: props.backgroundColor,
      padding: getSides(props.padding),
    },
  };
}
