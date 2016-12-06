import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SqInputRangeSlider from '../../framework/widgets/sq-input-range-slider/sq-input-range-slider'
import StyleGuideItem from 'react-style-guide';
import '../../node_modules/react-style-guide/node_modules/highlight.js/styles/github.css';

let containerStyle = {
  display: 'flex'
};

storiesOf('SqInputRangeSlider', module)
  .add('Horizontal Slider', () => (
  <div>
    <div className="inputcontainer" style={containerStyle}>
      <SqInputRangeSlider className="one two three" max={150} step={10} width={300} onChange={action('valueChanged')} />
    </div>
    <div className="inputcontainer" style={containerStyle}>
      <SqInputRangeSlider className="one two three" max={150} step={10} width={800} onChange={action('valueChanged')} />
    </div>
    <div className="inputcontainer" style={containerStyle}>
      <SqInputRangeSlider className="one two three" max={150} step={10} width={200} disabled onChange={action('valueChanged')} />
    </div>
  </div>
  ))
  .add('Vertical Slider', () => (
                                 <StyleGuideItem>
<div style={{display:'flex'}}>
  <div style={containerStyle}>
    <SqInputRangeSlider vertical={true} width={300}  onChange={action('valueChanged')} />
  </div>
  <div style={containerStyle}>
    <SqInputRangeSlider vertical={true} width={600}  onChange={action('valueChanged')} />
  </div>
  <div style={containerStyle}>
    <SqInputRangeSlider vertical={true} width={300}  onChange={action('valueChanged')} disabled={true} />
    <SqInputRangeSlider vertical={true} width={300}  onChange={action('valueChanged')} disabled={true} />
  </div>
</div>
</StyleGuideItem>
  ));
