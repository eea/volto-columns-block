import React from 'react';
import ColumnsBlockView from './ColumnsBlockView';
import AccordionView from '@eeacms/volto-accordion-block/components';
const ColumnBlockViewRender = (props) => {
  const {
    data,
    data: { display },
  } = props;
  if (display === 'Columns') {
    return <ColumnsBlockView {...props} />;
  } else {
    return <AccordionView {...props} />;
  }
};

export default ColumnBlockViewRender;
