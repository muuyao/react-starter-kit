import React, {Component, PropTypes, Children} from 'react';

import FullPage from './fullpage.js';
import styles from './fullpage.css';
import classNames from 'classnames';

class FullPageReact extends Component {

    componentDidMount() {
        const {start, duration, loop, drag, dir, der, change, beforeChange, afterChange, orientationchange} = this.props;

        if(this._element !== null){
            // 异步处理
            setTimeout(() => {
                this.instance = new FullPage(this._element, {
                    start,
                    duration,
                    loop,
                    drag,
                    dir,
                    der,
                    change,
                    beforeChange,
                    afterChange,
                    orientationchange
                });
            }, 0)
        }
    }

    componentWillUnmount() {
        this.instance.unholdTouch();
    }

    render() {

        return (
            <div className={styles.container}>
                <div
                    className={styles.inner}
                    ref={(c) => this._element = c}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

FullPageReact.propTypes = {
    start: PropTypes.number,
    duration: PropTypes.number,
    loop: PropTypes.bool,
    drag: PropTypes.bool,
    dir: PropTypes.oneOf(['v', 'h']),
    der: PropTypes.number, // 当滑动距离大于一个值时，才会引起滑动现象，滑动距离=der*屏幕高度|宽度，默认值为0.1
    change: PropTypes.func,
    beforeChange: PropTypes.func,
    afterChange: PropTypes.func,
    orientationchange: PropTypes.func
};

FullPageReact.defaultProps = {
    start: 0,
    duration: 500,
    loop: false,
    drag: false,
    dir: 'v',
    der: 0.1,
    change: function(data) {},
    beforeChange: function(data) {},
    afterChange: function(data) {},
    orientationchange: function(orientation) {}
};

class FullPageItem extends Component {
    render() {
        const {children, className, ...props} = this.props;

        return (
            <div {...props} className={classNames( 'page', className)}>
                {children}
            </div>
        );
    }
}

FullPageReact.Item = FullPageItem;

export default FullPageReact;
