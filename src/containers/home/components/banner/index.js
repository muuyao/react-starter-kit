import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import Slider from '../../../../components/slider';
import styles from './banner.css';

class Banners extends Component {

    render() {
        const {banners} = this.props;
        let sliderNode = null;

        if(!banners.length){
            return <div></div>
        }

        return (
            <div className={styles.banners}>
                <Slider>
                    {banners.map((item, index) => {
                        if(item.gotoUrl.indexOf('//') !== -1){
                            return (
                                <Slider.Item key={item.id}>
                                    <a href={item.gotoUrl ? item.gotoUrl : 'javascript:;'}>
                                        <img src={item.showUrl}/>
                                    </a>
                                </Slider.Item>
                            )
                        } else {
                            return (
                                <Slider.Item key={item.id}>
                                    <Link to={item.gotoUrl ? item.gotoUrl : 'javascript:;'}>
                                        <img src={item.showUrl}/>
                                    </Link>
                                </Slider.Item>
                            )
                        }
                    })}
                </Slider>
            </div>
        )
    }
}

export default Banners;
