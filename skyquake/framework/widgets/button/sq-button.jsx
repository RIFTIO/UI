import React from 'react';

import 'style/base.scss';
import './button.scss';

const icons = {
    check: require("style/icons/svg-sprite-navigation-symbol.svg")  + "#ic_check_24px"
}

export default class SqButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {icon, primary, size, disabled, label, ...props} = this.props;
        let svgHTML = null;
        let Class = "SqButton";
        if(icon) {
            svgHTML = <svg className="svg-24px SqButton-icon">
            <use xlinkHref={icons[icon]}></use></svg>;
        }
        if(primary) {
            Class += " SqButton--primary";
        } else {
            Class += " SqButton--normal";
        }
        if(size && (
                size == 'small'
                || size == 'medium'
                || size == 'large'
                )
            ) {
            Class += " SqButton--" + size;
        }
        if(disabled) {
            Class += " is-disabled";
        }
        return (
                <div style={{display: 'flex'}}>
            <div className={Class} tabIndex="0">
            {svgHTML}
              <div className="SqButton-content">{label}</div>
            </div>
            </div>
        )
    }
}

SqButton.defaultProps = {
    icon: false,
    primary: false,
    disabled: false,
    size: false, // 'small', 'medium', 'large'
    label: 'Submit'
}
