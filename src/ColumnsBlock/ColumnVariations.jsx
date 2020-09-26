import React from 'react';
import { Segment, Card } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

export default ({ data, onChange, children, variants }) => {
  // data by default is like { '@type': 'columns }
  return Object.keys(data).length === 1 ? (
    <Segment>
      <Card.Group>
        {variants.map(({ icon, defaultData, title }, index) => (
          <Card key={index} onClick={() => onChange(defaultData)}>
            <Card.Content>
              <Icon name={icon} />
              {title ? <Card.Header>{title}</Card.Header> : ''}
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Segment>
  ) : (
    children
  );
};
