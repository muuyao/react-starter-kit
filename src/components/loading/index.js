import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from './loading.css';

/**
 * Loading 组件
 *
 * {
 *     content: '',
 *     isPart: false,
 *     isOpen: true
 * }
 */
class Loading extends Component {
    constructor(props) {
        super(props);

        this.state = {
            closed: true
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

    open() {
        this.setState({closed: false});
    }

    close() {
        this.setState({closed: true});
    }

    render() {
        const {isPart, content} = this.props;
        const {closed} = this.state;

        let contentNode = null;

        if (content) {
            contentNode = (
                <p className={styles.cnt}>{content}</p>
            )
        }

        return (
            <div className={classNames(styles.loading, {
                [styles.isPart]: isPart,
                [styles.closed]: closed
            })}>
                <div className={styles.bd}>
                    <div className={styles.spinner}>
                        <span className={styles.spinnerBlade}></span>
                        <span className={styles.spinnerBlade}></span>
                        <span className={styles.spinnerBlade}></span>
                        <span className={styles.spinnerBlade}></span>
                        <span className={styles.spinnerBlade}></span>
                        <span className={styles.spinnerBlade}></span>
                        <span className={styles.spinnerBlade}></span>
                        <span className={styles.spinnerBlade}></span>
                        <span className={styles.spinnerBlade}></span>
                        <span className={styles.spinnerBlade}></span>
                        <span className={styles.spinnerBlade}></span>
                        <span className={styles.spinnerBlade}></span>
                    </div>
                    {contentNode}
                </div>
            </div>
        );
    }
}

Loading.propTypes = {
    isPart: PropTypes.bool,
    content: PropTypes.string,
    isOpen: PropTypes.bool
};

Loading.defaultProps = {
    isPart: false,
    content: '',
    isOpen: true
};

export default Loading;
