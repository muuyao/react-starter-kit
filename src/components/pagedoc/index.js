import React, {Component, PropTypes} from 'react';
import Detect from '../detect';

/**
 * 用于修改网页标题和 body class 等
 */
class PageDoc extends Component {

    componentDidMount() {
        const {title, cs} = this.props;

        this.setClass(cs);
        this.setTitle(title);
    }

    componentWillReceiveProps(nextProps) {
        const {title, cs} = this.props;
        if (nextProps.title !== title) {
            this.setTitle(nextProps.title)
        }

        if (nextProps.cs !== cs) {
            this.setClass(nextProps.cs);
        }
    }

    componentWillUnmount() {
        const {title, cs} = this.props;

        this.removeClass(cs);
    }

    setTitle(title) {
        if (title) {
            document.title = title;
        }

        // Magic iPhone 微信需要通过加载 iframe 来刷新 title
        if (Detect.os.ios && Detect.os.weixin) {
            var iframe = document.createElement("iframe");
            iframe.setAttribute("src", "/favicon.ico");
            iframe.style.display = 'none';
            iframe.addEventListener('load', function() {
                setTimeout(function() {
                    //iframe.removeEventListener('load');
                    document.body.removeChild(iframe);
                }, 0);
            });
            document.body.appendChild(iframe);
        }
    }

    setClass(cs) {
        if (cs) {
            document.body.classList.add(cs);
        }
    }

    removeClass(cs) {
        if (cs) {
            document.body.classList.remove(cs);
        }
    }

    render() {
        const {
            component: Component,
            cs,
            title,
            ...props
        } = this.props;

        return (
            <Component {...props}>
                {this.props.children}
            </Component>
        )
    }
}

PageDoc.propTypes = {
    component: PropTypes.any,
    title: PropTypes.string,
    cs: PropTypes.string
}

PageDoc.defaultProps = {
    component: 'div',
    title: '叮叮互助',
    cs: ''
}

export default PageDoc;
