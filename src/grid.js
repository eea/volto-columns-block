import iconA from '@plone/volto/icons/circle-left.svg';
import iconB from '@plone/volto/icons/circle-menu.svg';
import iconC from '@plone/volto/icons/circle-minus.svg';
import iconD from '@plone/volto/icons/circle-plus.svg';
import iconE from '@plone/volto/icons/circle-right.svg';
import iconF from '@plone/volto/icons/audio.svg';

export const gridSizes = {
  halfWidth: {
    mobile: 12,
    tablet: 6,
    computer: 6,
  },
  twoThirds: {
    mobile: 12,
    tablet: 8,
    computer: 9,
  },
  oneThird: {
    mobile: 12,
    tablet: 4,
    computer: 3,
  },
  halfWidthBig: {
    mobile: 12,
    tablet: 8,
    computer: 6,
  },
  oneThirdSmall: {
    mobile: 12,
    tablet: 2,
    computer: 3,
  },
  oneQuarter: {
    mobile: 12,
    tablet: 6,
    computer: 3,
  },
};

export const variants = [
  {
    icon: iconA,
    defaultData: {
      gridSize: 12,
      gridCols: ['halfWidth', 'halfWidth'],
    },
    title: '50 / 50',
  },
  {
    icon: iconB,
    defaultData: {
      gridSize: 12,
      gridCols: ['oneThird', 'twoThirds'],
    },
    title: '30 / 70',
  },
  {
    icon: iconC,
    defaultData: {
      gridSize: 12,
      gridCols: ['twoThirds', 'oneThird'],
    },
    title: '70 / 30',
  },
  {
    icon: iconD,
    defaultData: {
      gridSize: 12,
      gridCols: ['oneThird', 'oneThird', 'oneThird'],
    },
    title: '33 / 33 / 33',
  },
  {
    icon: iconE,
    defaultData: {
      gridSize: 12,
      gridCols: ['oneThirdSmall', 'halfWidthBig', 'oneThirdSmall'],
    },
    title: '25 / 50 / 25',
  },
  {
    icon: iconF,
    defaultData: {
      gridSize: 12,
      gridCols: ['oneQuarter', 'oneQuarter', 'oneQuarter', 'oneQuarter'],
    },
    title: '25 / 25 / 25 / 25',
  },
];
