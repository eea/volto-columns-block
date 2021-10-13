const styles = {
  range: {
    cursor: 'pointer',
    width: '100%',
    height: '30px',
  },
  inner: {
    margin: '0 10px 0 10px',
    height: '30px',
    position: 'relative',
  },
  /*
    .ui.range .inner:hover {
      cursor: pointer;
    }*/
  track: {
    position: 'absolute',
    width: '100%',
    height: '4px',
    borderRadius: '4px',
    top: '12px',
    left: '0',
    backgroundColor: 'rgba(0,0,0,.05)',
  },
  invertedTrack: {
    backgroundColor: 'rgba(255,255,255,.08)',
  },
  trackFill: {
    position: 'absolute',
    width: '0',
    height: '4px',
    borderRadius: '4px',
    top: '12px',
    left: '0',
    backgroundColor: '#1b1c1d',
  },
  invertedTrackFill: {
    backgroundColor: '#545454',
  },
  knob: {
    position: 'absolute',
    top: '0px',
    left: '0',
    height: '30px',
    width: '20px',
    background: '#fff linear-gradient(transparent, rgba(0, 0, 0, 0.5))',
    // background: '#fff -webkit-linear-gradient(transparent, rgba(0, 0, 0, 0.5))',
    // background: '#fff -o-linear-gradient(transparent, rgba(0, 0, 0, 0.5))',
    // background: '#fff -moz-linear-gradient(transparent, rgba(0, 0, 0, 0.5))',
    borderRadius: '6px',
    backgroundColor: '#205c90',
    boxShadow:
      '0 1px 2px 0 rgba(34,36,38,.15),0 0 0 1px rgba(34,36,38,.15) inset',
    display: 'flex',
    color: 'white',
    flexDirection: 'column',
    textAlign: 'center',
    fontSize: 'xx-small',
  },
  red: {
    backgroundColor: '#DB2828',
  },
  'inverted-red': {
    backgroundColor: '#FF695E',
  },
  /* Orange */
  orange: {
    backgroundColor: '#F2711C',
  },
  'inverted-orange': {
    backgroundColor: '#FF851B',
  },
  /* Yellow */
  yellow: {
    backgroundColor: '#FBBD08',
  },
  'inverted-yellow': {
    backgroundColor: '#FFE21F',
  },
  /* Olive */
  olive: {
    backgroundColor: '#B5CC18',
  },
  'inverted-olive': {
    backgroundColor: '#D9E778',
  },
  /* Green */
  green: {
    backgroundColor: '#21BA45',
  },
  'inverted-green': {
    backgroundColor: '#2ECC40',
  },
  /* Teal */
  teal: {
    backgroundColor: '#00B5AD',
  },
  'inverted-teal': {
    backgroundColor: '#6DFFFF',
  },
  /* Blue */
  blue: {
    backgroundColor: '#2185D0',
  },
  'inverted-blue': {
    backgroundColor: '#54C8FF',
  },
  /* Violet */
  violet: {
    backgroundColor: '#6435C9',
  },
  'inverted-violet': {
    backgroundColor: '#A291FB',
  },
  /* Purple */
  purple: {
    backgroundColor: '#A333C8',
  },
  'inverted-purple': {
    backgroundColor: '#DC73FF',
  },
  /* Pink */
  pink: {
    backgroundColor: '#E03997',
  },
  'inverted-pink': {
    backgroundColor: '#FF8EDF',
  },
  /* Brown */
  brown: {
    backgroundColor: '#A5673F',
  },
  'inverted-brown': {
    backgroundColor: '#D67C1C',
  },
  /* Grey */
  grey: {
    backgroundColor: '#767676',
  },
  'inverted-grey': {
    backgroundColor: '#DCDDDE',
  },
  /* Black */
  black: {
    backgroundColor: '#1b1c1d',
  },
  'inverted-black': {
    backgroundColor: '#545454',
  },
  /*--------------
    Disabled
---------------*/
  disabled: {
    cursor: 'not-allowed',
    opacity: '.5',
  },

  /*--------------
    Disabled
---------------*/

  disabledTrackFill: {
    backgroundColor: '#ccc',
  },

  /*--------------
    Invalid-Input
---------------*/
  invalidInputTrack: {
    cursor: 'not-allowed',
    opacity: '.3',
    background: '#ff0000',
  },
  invalidInputTrackFill: {
    opacity: '.0',
  },
};

export default styles;
