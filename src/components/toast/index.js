import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';
import styles from './toast.css';

class Toast extends Component {
    constructor(props) {
        super(props);

        this.state = {
            closed: true,
            isClosing: false
        };
    }

    componentDidMount() {
        if (this.props.isOpen) {
            this.open();
        }
    }

    componentWillReceiveProps(nextProps) {
        let isOpen = this.props.isOpen;

        if (!isOpen && nextProps.isOpen) {
            this.open();
        } else if (isOpen && !nextProps.isOpen) {
            this.close();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    open() {
        if(!this.state.closed){
            return;
        }

        this.setState({
            closed: false,
            isClosing: false
        });

        this.timeout = setTimeout(()=>{
            this.close()
        }, this.props.duration);
    }

    close() {
        if(this.state.closed || this.state.isClosing){
            return;
        }

        this.setState({isClosing: true});
    }

    onTransitionEnd() {
        if(!this.state.isClosing){
            return;
        }
        this.props.callback();

        this.setState({
            closed: true,
            isClosing: false
        })
    }

    render() {
        const {content, className} = this.props;
        const {isClosing, closed} = this.state;

        return (
            <div
                className={classNames(styles.toast, {
                    [styles.closed]: closed
                })}
                onTransitionEnd={()=>this.onTransitionEnd()}
                >
                <div className={classNames(styles.bd, className, {
                        [styles.isClosing]: isClosing
                    })}>
                    <p className={styles.cnt}>{content}</p>
                </div>
            </div>
        );
    }
}

Toast.propTypes = {
    isOpen: PropTypes.bool,
    content: PropTypes.string.isRequired,
    duration: PropTypes.number,
    callback: PropTypes.func
};

Toast.defaultProps = {
    isOpen: true,
    content: '请求出错,请稍后刷新重试',
    className: '',
    duration: 1500,
    callback: ()=>{}
};

export default Toast;
