import React from 'react';

import ColumnsBlockEdit from '@eeacms/volto-columns-block/ColumnsBlock';
import AccordionBlockEdit from '@eeacms/volto-accordion-block/components';
import Chooser from './Chooser';
import { options } from './options';
const ColumnsBlockChooser = (props) => {
  const { data } = props;
  const [display, setDisplay] = React.useState('');

  if (display === '' && Object.keys(data).length === 1) {
    return (
      <div role="presentation" className="columns-block">
        <Chooser
          variants={options}
          onChange={(initialData) => {
            setDisplay(initialData);
          }}
        />
      </div>
    );
  } else if (display === 'Columns') {
    return <ColumnsBlockEdit {...props} />;
  } else return <AccordionBlockEdit {...props} />;
};

export default ColumnsBlockChooser;
