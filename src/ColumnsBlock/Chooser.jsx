import React from 'react';
import { Segment, Card } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

export default ({ onChange, variants }) => {
  return (
    <Segment>
      <h4>Select layout:</h4>
      <Card.Group centered itemsPerRow={7}>
        {variants.map(({ icon, title }, index) => (
          <Card key={index} onClick={() => onChange(title)}>
            <Card.Content>
              <Icon name={icon} size="55" />
              {title ? <p>{title}</p> : ''}
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Segment>
  );
};
