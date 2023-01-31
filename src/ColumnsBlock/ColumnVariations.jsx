import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Segment, Card } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

const messages = defineMessages({
  selectLayout: {
    id: 'Select layout',
    defaultMessage: 'Select layout',
  },
});

const ColumnVariations = ({ onChange, variants, intl }) => {
  return (
    <Segment>
      <h4>{intl.formatMessage(messages.selectLayout)}:</h4>
      <Card.Group centered itemsPerRow={7}>
        {variants.map(({ icon, defaultData, title }, index) => (
          <Card key={index} onClick={() => onChange(defaultData)}>
            <Card.Content>
              <Icon name={icon} size="55px" />
              {title ? <p>{title}</p> : ''}
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Segment>
  );
};

export default injectIntl(ColumnVariations);
