import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './globalnav.css';

class GlobalNav extends Component {
    render() {
        return(
            <nav className={styles.nav}>
                <Link to="/huzhu/" className={styles.projects} activeClassName={styles.active} onlyActiveOnIndex={true}>
                    <i className={styles.icon}></i><span>互助计划</span>
                </Link>
                <Link to="/huzhu/annc" className={styles.annc} activeClassName={styles.active}>
                    <i className={styles.icon}></i><span>互助公示</span>
                </Link>
                <Link to="/huzhu/share" className={styles.share} activeClassName={styles.active}>
                    <i className={styles.icon}></i><span>邀请好友</span>
                </Link>
                <Link to="/huzhu/account" className={styles.account} activeClassName={styles.active}>
                    <i className={styles.icon}></i><span>个人中心</span>
                </Link>
            </nav>
        );
    }
}

export default GlobalNav;
