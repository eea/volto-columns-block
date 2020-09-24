import React from 'react';

import { Icon } from '@plone/volto/components';

import computerIcon from './icons/desktop-computer.svg';
import mobileIcon from './icons/device-mobile.svg';
import tabletIcon from './icons/device-tablet.svg';

export default (props) => {
  return (
    <div>
      <Icon name={computerIcon} size="24px" />
      <Icon name={tabletIcon} size="24px" />
      <Icon name={mobileIcon} size="24px" />
    </div>
  );
};
