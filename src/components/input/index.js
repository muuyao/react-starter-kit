import React, { Component, PropTypes } from 'react';
import styles from './input.css';

class Input extends Component {

    handleChange(e) {
        const {name, onValueChange} = this.props;
        if(onValueChange){
            onValueChange(name, e.target.value)
        }
    }

    render() {
        const {onValueChange, label, ...props} = this.props
        return (
            <div className={styles.item}>
                <label className={styles.label}>{label}</label>
                <input
                    {...props}
                    className={styles.input}
                    onChange={(e) => this.handleChange(e)}/>
            </div>
        )
    }
}

Input.propTypes={
    label: PropTypes.string,
    onValueChange: PropTypes.func
}

export default Input;
