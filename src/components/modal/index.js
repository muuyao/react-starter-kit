import React, {Component, PropTypes} from 'react';
import Touchable from '../touchable';
import classNames from 'classnames';
import styles from './modal.css';

/**
 * Modal 组件
 */
class Modal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            closed: !this.props.isOpen
        };
    }

    componentDidMount() {
        if (this.props.isOpen) {
            this.open();
        }
    }

    componentWillReceiveProps(nextProps) {
        let isOpen = !this.state.closed;

        if (!isOpen && nextProps.isOpen) {
            this.open();
        } else if (isOpen && !nextProps.isOpen) {
            this.close();
        }
    }

    open() {
        this.setState({closed: false});
    }

    close() {
        this.setState({closed: true});
    }

    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const {onAction} = this.props;
        const role = e.target.dataset.role;

        if (onAction) {
            onAction(role);
        }

        this.close();
    }

    rawMarkup(content) {
        return {__html: content};
    }

    render() {
        const {role, title, confirmText, cancelText, content} = this.props;
        const {closed} = this.state;

        let modalNode = null;
        if (role == 'alert' || role == 'confirm') {
            modalNode = (
                <div className={styles.bd}>
                    <h2 className={styles.title}>
                        <span className={styles.textLine}>{title}</span>
                    </h2>
                    <p
                        className={styles.content}
                        dangerouslySetInnerHTML={this.rawMarkup(content)}/>

                    <div className={styles.btnGroup}>
                        <Touchable
                            component="button"
                            activeType="opacity"
                            type="button"
                            className={classNames(styles.cancel, {
                                [styles.hidden]: role === 'alert'
                            })}
                            data-role='cancel'
                            onClick={(e) => this.handleClick(e)}>
                            {cancelText}
                        </Touchable>
                        <Touchable
                            component="button"
                            activeType="opacity"
                            type="button"
                            className={classNames(styles.confirm)}
                            data-role='confirm'
                            onClick={(e) => this.handleClick(e)}>
                            {confirmText}
                        </Touchable>
                    </div>
                </div>
            )
        }

        return (
            <div className={classNames(styles.modal, {
                [styles.hidden]: closed
            })} onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}>
                {modalNode}
            </div>
        );
    }
}

Modal.propTypes = {
    isOpen: PropTypes.bool,
    role: PropTypes.oneOf(['alert', 'confirm']),
    title: PropTypes.string,
    content: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onAction: PropTypes.func // role为 cancel/confirm
};

Modal.defaultProps = {
    isOpen: false,
    title: '',
    content: '',
    confirmText: '确认',
    cancelText: '取消',
    onAction: null
};

export default Modal;
