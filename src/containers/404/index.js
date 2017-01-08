import React, {Component} from 'react';
import {Link} from 'react-router';
import Touchable from '../../components/touchable';
import PageDoc from '../../components/pagedoc';

import styles from './404.css';

class PageNotFound extends Component {
    render() {
        return (
            <PageDoc title="页面不存在" className={styles.empty}>
                <h1>404</h1>
                <p>对不起, 该页面不存在</p>
                <Touchable component={Link} to="/huzhu" activeType="opacity" className={styles.btn}>
                    返回首页
                </Touchable>
            </PageDoc>
        )
    }
}

module.exports = PageNotFound;
