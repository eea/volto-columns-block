import React from 'react';

import ColumnsBlockEdit from './ColumnsBlockEdit';
import AccordionBlockEdit from '@eeacms/volto-accordion-block/components';
import Chooser from './Chooser';
import { options } from './options';

const ColumnsBlockChooser = (props) => {
  const {
    data,
    onChangeBlock,
    block,
    data: { display = 'Columns' },
  } = props;

  if (Object.keys(data).length === 1) {
    return (
      <div role="presentation" className="columns-block">
        <Chooser
          variants={options}
          onChange={(initialData) => {
            onChangeBlock(block, {
              ...data,
              display: initialData,
            });
          }}
        />
      </div>
    );
  } else if (display === 'Columns') {
    return <ColumnsBlockEdit {...props} />;
  } else return <AccordionBlockEdit {...props} />;
};

export default ColumnsBlockChooser;
