import React, {Component, PropTypes, Children} from 'react';

import Touchable from '../touchable';
import styles from './slider.css';
import classNames from 'classnames';

class Slider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: this.props.defaultActiveIndex == null
                ? 0
                : this.props.defaultActiveIndex,
            previousActiveIndex: null,
            direction: null
        };

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleItemTransitionEnd = this.handleItemTransitionEnd.bind(this);
        this.handleSwipeLeft = this.handleSwipeLeft.bind(this);
        this.handleSwipeRight = this.handleSwipeRight.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
    }

    componentDidMount() {
        this.props.autoPlay && this.waitForNext();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    getDirection(prevIndex, index) {
        if (prevIndex === index) {
            return null;
        }

        return prevIndex > index
            ? 'prev'
            : 'next';
    }

    next(e) {
        e && e.preventDefault();

        let index = this.state.activeIndex + 1;
        let count = React.Children.count(this.props.children);

        if (index > count - 1) {
            if (!this.props.loop) {
                return;
            }
            index = 0;
        }

        this.handleSelect(index, 'next');
    }

    prev(e) {
        e && e.preventDefault();

        let index = this.state.activeIndex - 1;

        if (index < 0) {
            if (!this.props.loop) {
                return;
            }
            index = React.Children.count(this.props.children) - 1;
        }

        this.handleSelect(index, 'prev');
    }

    handleSelect(index, direction, e) {
        e && e.preventDefault();
        clearTimeout(this.timeout);

        let previousActiveIndex = this.state.activeIndex;

        direction = direction || this.getDirection(previousActiveIndex, index);

        if (this.props.onAction) {
            this.props.onAction(index, direction);
        }

        if (index !== previousActiveIndex) {
            this.setState({activeIndex: index, previousActiveIndex: previousActiveIndex, direction: direction});
        }
    }

    pause() {
        this.isPaused = true;
        clearTimeout(this.timeout);
    }

    play() {
        this.isPaused = false;
        this.waitForNext();
    }

    handleItemTransitionEnd() {
        this.waitForNext();

        if (this.props.onSlideEnd) {
            this.props.onSlideEnd();
        }
    }

    waitForNext() {
        if (!this.isPaused && this.props.interval) {
            this.timeout = setTimeout(this.next, this.props.interval);
        }
    }

    handleMouseOver() {
        if (this.props.pauseOnHover) {
            this.pause();
        }
    }

    handleMouseOut() {
        if (this.isPaused) {
            this.play();
        }
    }

    handleSwipeLeft(e) {
        // console.log('swipe left');
        this.next();
    }

    handleSwipeRight(e) {
        // console.log('swipe right....');
        this.prev();
    }

    renderItem(child, index) {
        let props = {
            count: Children.count(this.props.children),
            active: this.state.activeIndex === index,
            index: index
        }

        return React.cloneElement(child, props);
    }

    render() {

        const {children} = this.props;
        const {activeIndex} = this.state;
        const count = Children.count(children);
        const width = count * 100 + '%';
        const transform = `translate3d(-${activeIndex * 100 / count}%,0,0)`;

        let slidesStyle = {
            width: width,
            WebkitTransform: transform,
            transform: transform
        }

        let pagerNode = null;

        if (this.props.pager) {
            pagerNode = (<SlideDots count={count} activeIndex={activeIndex} handleSelect={this.handleSelect}/>)
        }

        return (
            <Touchable component="div" className={styles.slider} onTapActive={this.handleMouseOver} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} onSwipeLeft={this.handleSwipeLeft} onSwipeRight={this.handleSwipeRight} preventDefault={false} stopPropagation={true}>
                <ul className={styles.slides} style={slidesStyle} onTransitionEnd={this.handleItemTransitionEnd}>
                    {Children.map(children, this.renderItem.bind(this))}
                </ul>
                {pagerNode}
            </Touchable>
        )
    }
}

Slider.propTypes = {
    pager: PropTypes.bool, // indicators

    interval: PropTypes.number, // interval
    autoPlay: PropTypes.bool,
    loop: PropTypes.bool, // loop slide

    pauseOnHover: PropTypes.bool,
    // touch: PropTypes.bool,

    onAction: PropTypes.func,
    onSlideEnd: PropTypes.func,

    defaultActiveIndex: PropTypes.number
}

Slider.defaultProps = {
    pager: true,
    interval: 5000,
    autoPlay: true,
    loop: true,
    pauseOnHover: true,
    defaultActiveIndex: 0
}

class SliderItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {count, item} = this.props;
        const width = 100 / count + '%';

        return (
            <li className={styles.item} style={{
                width: width
            }}>
                {this.props.children}
            </li>
        )
    }
}

class SlideDots extends Component {

    handleDotClick(index) {
        this.props.handleSelect(index);
    }

    render() {
        const {count, activeIndex} = this.props;
        let dotNodes = [];

        if(count > 1){
            for (let i = 0; i < count; i++) {
                dotNodes[i] = (
                    <span key={'dot' + i} className={classNames({
                        [styles.dot]: true,
                        [styles.dotActive]: i === activeIndex
                    })} onClick={this.handleDotClick.bind(this, i)}></span>
                );
            }
        }

        return (
            <div className={styles.pager}>
                {dotNodes}
            </div>
        )
    }
}

Slider.Item = SliderItem;

export default Slider;
