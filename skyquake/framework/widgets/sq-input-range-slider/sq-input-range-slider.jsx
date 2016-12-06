import React from 'react';
import './sq-input-range-slider.scss';

export default class SqInputRangeSlider extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.state.position = {
            left: 50
        };
        this.className = "SqRangeInput";
    }

    updateHandle = (e) => {
        this.props.onChange(e.target.valueAsNumber);
    }

    render() {
        const {vertical, className, min, max, step,  width, disabled, ...props} = this.props;
        let class_name = this.className;
        let dataListHTML = null;
        let dataListOptions = null;
        let dataListID = null;
        let inputStyle = {};
        let inputContainer = {
        };
        let style = {
            width: width + 'px'
        }
        if(vertical) {
            class_name += ' ' + this.className + '--vertical';
            style.position = 'absolute';
            style.left = (width * -1 + 32) + 'px';
            style.width = width + 'px';
            inputContainer.margin = '0 10px';
            inputContainer.width = '70px';
            inputContainer.height = (width + 40) + 'px';
            inputContainer.background = 'white';
            inputContainer.border = '1px solid #ccc';
        } else {
            class_name += ' ' + this.className + '--horizontal';
            // style.position = 'absolute';
            // style.top = 12 + 'px';
            inputContainer.margin = '10px 0px';
            inputContainer.height = '70px';
            inputContainer.width = (width + 40) + 'px';
            inputContainer.background = 'white';
            inputContainer.border = '1px solid #ccc';
        }
        return (
                <div className={this.className + '--container'} style={inputContainer}>
                    <div className={class_name + ' ' + className + (disabled ? ' is-disabled' : '')}>
                        <input
                            style={style}
                            orient= {vertical ? "vertical" : "horizontal"}
                            type="range"
                            onChange={this.updateHandle}
                            ref="range"
                            max={max}
                            min={min}
                            step={step}
                            disabled={disabled}
                         />
                     </div>
                 </div>
        )
    }
}

SqInputRangeSlider.defaultProps = {
    //Horizontal vs Vertical Slider
    vertical: false,
    //Override classes
    className: '',
    min:0,
    max:100,
    step: 1,
    //width/length in px
    width:100,
    disabled: false,
    onChange: function(value) {
        console.log(value);
    }
}
