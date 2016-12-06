import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Button from '../../framework/widgets/button/rw.button'
import SqButton from '../../framework/widgets/button/sq-button'
import reactToJsx from 'react-to-jsx';
import StyleGuideItem from 'react-style-guide';
import '../../node_modules/react-style-guide/node_modules/highlight.js/styles/github.css';

let sqButtonHTML = ( <div style={{display: 'flex', padding: '10px'}}>
        <SqButton  icon="check" label="Normal" className="dark"/>
        <SqButton  label="Medium No Icon" size="medium" className="dark"/>
        <SqButton size="large"  icon="check" label="Large" className="dark"/>
        <SqButton size="large" primary  icon="check" label="Large" className="dark"/>
        <SqButton size="large" disabled icon="check" label="Disabled" className="dark"/>
    </div>)

storiesOf('Button', module)
  .add('A Light Button', () => (
    <Button onClick={action('clicked')} label="A Light Button!" className="light" />
  ))
  .add('A Dark Button', () => (
    <StyleGuideItem>
    <Button  label="A Dark Button!" className="dark"/>
    </StyleGuideItem>
  ))
  .add('A Sq Button', () => (
                             <StyleGuideItem>
   <div style={{display: 'flex', margin: '10px 10px 50px 10px'}}>
        <SqButton  icon="check" label="Submit" />
        <SqButton  label="Medium No Icon" size="medium" />
        <SqButton size="large"  icon="check" label="Large" />
        <SqButton size="large" primary  icon="check" label="Large" />
        <SqButton size="large" disabled icon="check" label="Disabled" />
        </div>
    </StyleGuideItem>
  ));
