import React, { Component, PropTypes } from 'react';
import styles from './inputradio.css';
import classNames from 'classnames';

class InputRadio extends Component {

    handleChange(e) {
        const {onValueChange} = this.props;

        if(onValueChange){
            onValueChange(this.props.name, e.target.value);
        }
    }

    render() {

        const {label, data, value, onValueChange, ...props} = this.props
        return (
            <div className={styles.item}>
                <label className={styles.label}>{label}</label>
                <div className={styles.radioGroup}>
                    {
                        data.map((item, index) => {
                            return (
                                <label
                                    key={index}
                                    className={classNames(
                                        styles.radio,
                                        {
                                            [styles.checked]: value === item.value
                                        }
                                    )}>
                                    <input
                                        {...props}
                                        name={name}
                                        type='radio'
                                        value={item.value}
                                        checked={value === item.value}
                                        onChange={(e) => this.handleChange(e)}/>
                                    {item.name}
                                </label>
                            )
                        })
                    }

                </div>
            </div>
        )
    }
}

InputRadio.propTypes={
    data: PropTypes.array,
    onValueChange: PropTypes.func
}

export default InputRadio;
