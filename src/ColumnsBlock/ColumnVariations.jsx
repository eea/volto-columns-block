import React from 'react';
import { Segment, Card } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { isEqual } from 'lodash';

export default React.memo(
  ({ data, onChange, children, variants }) => {
    // data by default is like { '@type': 'columns }
    const mounted = React.useRef();
    React.useEffect(() => {
      if (!mounted.current) console.log('mount column variations');
      mounted.current = true;
    });

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
  },
  (p, n) => {
    const res =
      isEqual(p.data, n.data) &&
      p.selected === n.selected &&
      isEqual(n.colSelections, p.colSelections);
    console.log('variantions', res);
    return res;
  },
);
