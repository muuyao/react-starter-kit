import React, {Component, PropTypes} from 'react';
import styles from './touchable.css';
import classNames from 'classnames';

/**
 * touchable 组件
 * 实现 tab/swipe 事件
 *
 * 功能：
 * 1. tapActive - bgc/opacity/shadow 添加 tap style
 * 2. onTap/onTapActive/onSwipe/onSwipeUp/onSwipeLeft/onSwipeDown/onSwipeRight
 */
class Touchable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tapActive: false,
            isMove: false
        }
    }

    componentWillMount() {
        this._resetTouch();
    }

    componentWillUnmount() {
        this._cancelAll();
    }

    handleTouchStart(e) {
        // console.log('handle touchstart', +new Date());
        this.processEvent(e);

        if (!e.touches) {
            return;
        }

        let touch = this.touchState.touch;
        let startTouch = e.touches[0];

        if (e.touches.length === 1 && touch.x2) {
            // Clear out touch movement data if we have it sticking around
            // This can occur if touchcancel doesn't fire due to preventDefault, etc.
            touch.x2 = undefined;
            touch.y2 = undefined;
        }

        let now = Date.now();
        let delta = now - (touch.last || now);

        this._touchTimeout && clearTimeout(this._touchTimeout);

        touch.x1 = startTouch.pageX;
        touch.y1 = startTouch.pageY;

        // record last touch start time
        touch.last = now;

        this.touchState = {...this.touchState, ...{startTouch, touch}};

        this._activeTimeout = setTimeout(()=>{
            if(!this.state.isMove){
                let event = {};
                event.type = 'tapActive';
                // event.cancelTouch = cancelAll;
                this._handleEvent(event);

                this.setState({
                    tapActive: true
                });
            }
        }, this.props.activeDelay);
    }

    handleTouchMove(e) {
        // console.log('touch move');
        this.processEvent(e);

        this.setState({
            isMove: true
        })

        let endTouch = e.touches[0];
        let {touch, deltaX, deltaY} = this.touchState;

        touch.x2 = endTouch.pageX;
        touch.y2 = endTouch.pageY;

        // finger moving distance
        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);

        this.touchState = {...this.touchState, ...{deltaX, deltaY, touch, endTouch}};
    }

    handleTouchEnd(e) {
        // console.log('touch end..', this.touchState, this.props);
        this.processEvent(e);

        this.setState({
            tabActive: false,
            isMove: false
        });

        let {tapDelay, moveThreshold, activeDelay} = this.props;
        let {touch, startTouch, endTouch, deltaX, deltaY} = this.touchState;
        let event = {
            touch,
            startTouch,
            endTouch,
            preventDefault: () => {}
        };

        // handle as swipe event
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > moveThreshold) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > moveThreshold)) {

            event.type = 'swipe';

            this._swipeTimeout = setTimeout(() => {
                this._handleEvent(event);

                event.type += this._getSwipeDirection();
                this._handleEvent(event);
                this._resetTouch();
            }, 0 // normal tap
            );
        } else if ('last' in touch) {
            // don't fire tap when delta position changed by more than 30 pixels,
            // for instance when moving to a point and back to origin
            if (deltaX < moveThreshold && deltaY < moveThreshold) {
                // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                // ('tap' fires before 'scroll')

                this._tapTimeout = setTimeout(() => {
                    // trigger universal 'tap' with the option to cancelTouch()
                    // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                    //event.type = 'tapActive';
                    // event.cancelTouch = cancelAll;
                    //this._handleEvent(event);

                    // trigger tap after tapDelay
                    this._touchTimeout = setTimeout(() => {
                        this._touchTimeout = null;
                        event.type = 'tap';
                        this._handleEvent(event);
                        this._resetTouch();
                    }, tapDelay)
                }, 0);
            } else {
                this._resetTouch();
            }
        }
    }

    handleTouchCancel() {
        this._cancelAll();
    }

    processEvent(e) {
        this.props.preventDefault && e.preventDefault();
        this.props.stopPropagation && e.stopPropagation();
    }

    _cancelAll() {
        if (this._touchTimeout) {
            clearTimeout(this._touchTimeout);
        }

        if (this._tapTimeout) {
            clearTimeout(this._tapTimeout);
        }

        if (this._swipeTimeout) {
            clearTimeout(this._swipeTimeout);
        }


        if(this._activeTimeout){
            clearTimeout(this._activeTimeout)
        }

        this._touchTimeout = this._tapTimeout = this._swipeTimeout = this._activeTimeout = null;
        this._resetTouch();
    }

    _getSwipeDirection() {
        let {x1, x2, y1, y2} = this.touchState.touch;

        // 水平方向：水平距离大于等于垂直距离
        // 垂直方向：
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
            ? (x1 - x2 > 0
                ? 'Left'
                : 'Right')
            : (y1 - y2 > 0
                ? 'Up'
                : 'Down');
    }

    _resetTouch() {
        this.touchState = {
            startTouch: null,
            endTouch: null,
            touch: {},
            deltaX: 0,
            deltaY: 0
        };

        this.setState({
            tapActive: false
        })
    }

    _getEventMethodName(type) {
        return 'on' + type.charAt(0).toUpperCase() + type.slice(1);
    }

    _handleEvent(event) {
        let method = this._getEventMethodName(event.type);
        this.props[method] && this.props[method](event);
    }

    render() {
        const { tapActive } = this.state;
        const {
            component: Component,
            activeType,
            className,
            ...props
        } = this.props;

        let newProps = {...props, ...{
            onTouchStart: this.handleTouchStart.bind(this),
            onTouchEnd: this.handleTouchEnd.bind(this),
            onTouchCancel: this.handleTouchCancel.bind(this),
            onTouchMove: this.handleTouchMove.bind(this)
        }};

        delete newProps.moveThreshold;
        delete newProps.tapDelay;
        delete newProps.activeDelay;
        delete newProps.preventDefault;
        delete newProps.stopPropagation;
        delete newProps.onSwipe;
        delete newProps.onSwipeLeft;
        delete newProps.onSwipeUp;
        delete newProps.onSwipeRight;
        delete newProps.onSwipeDown;
        delete newProps.onTap;
        delete newProps.onTapActive;

        // 添加 tapactive class
        const newClassNames = classNames(className, {
            [styles[activeType]]: tapActive && activeType
        });

        return (
            <Component {...newProps} className={newClassNames}>
                {this.props.children}
            </Component>
        )
    }
}

Touchable.propTypes = {
    component: PropTypes.any,
    moveThreshold: PropTypes.number,
    tapDelay: PropTypes.number,
    activeDelay: PropTypes.number,
    preventDefault: PropTypes.bool,
    stopPropagation: PropTypes.bool,

    onSwipe: PropTypes.func,
    onSwipeLeft: PropTypes.func,
    onSwipeUp: PropTypes.func,
    onSwipeRight: PropTypes.func,
    onSwipeDown: PropTypes.func,
    onTap: PropTypes.func,
    onTapActive: PropTypes.func,

    activeType: PropTypes.string
}

Touchable.defaultProps = {
    component: 'span',
    moveThreshold: 30,
    activeDelay: 30,
    tapDelay: 100,
    preventDefault: false,
    stopPropagation: false
}

export default Touchable;
