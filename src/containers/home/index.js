import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {loadBanners, loadCatList} from '../../actions/home';

import PageDoc from '../../components/pagedoc';
import GlobalNav from '../../components/globalnav';
import CatList from './components/catlist';
import Banners from './components/banner';

class Home extends Component {

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(loadBanners());
        dispatch(loadCatList());
    }

    render() {
        const {banners, catList} = this.props;

        return (
            <PageDoc title="叮叮互助">
                <Banners banners={banners}/>
                <CatList catList={catList}/>
                <GlobalNav/>
            </PageDoc>
        )
    }
}

Home.propTypes = {
    banners: PropTypes.array.isRequired,
    catList: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    const {
        pagination: {
            bannersByPage,
            catsByPage
        },
        entities: {
            banners,
            cats
        }
    } = state;

    const homeBannerPage = bannersByPage.home || {ids: []};
    const homeCatListPage = catsByPage.home || {ids: []};

    const homeBanners = homeBannerPage.ids.map(id => banners[id]);
    const homeCatList = homeCatListPage.ids.map(id => cats[id]);

    return {banners: homeBanners, catList: homeCatList}
}

module.exports = connect(mapStateToProps)(Home);
