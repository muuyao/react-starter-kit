import React, {Component} from 'react';
import {connect} from 'react-redux';
import { removeToast } from '../actions/global';
import { recordShareInfo } from '../actions/home';
import wxUtils from '../components/wx-utils';

import Loading from '../components/loading';
import Toast from '../components/toast';

import FastClick from 'fastclick';

window.addEventListener('load', () => {
  FastClick.attach(document.body);
});

class App extends Component {

    componentWillMount() {

        const {user, dispatch, global} = this.props;
        const location  = window.location;

        this.wxShare();

        // 提交分享信息
        if(global.invitePatientId){

            dispatch(recordShareInfo(global.invitePatientId));
        }
    }

    componentWillReceiveProps() {
        this.wxShare();
    }

    wxShare() {
        const {user, dispatch, global} = this.props;

        // 开启微信手动授权分享
        wxUtils.openPageShare(true, {
            link: `${location.protocol + '//' + location.host}/huzhu`,
            title: '0元加入叮叮互助，帮助他人，保障自己，最高可获得30万互助金',
            desc: '中国首个大病患者互助平台，有人需要帮助时，大家协力相助。',
            imgUrl: 'http://static.hz-01.dingdingyisheng.mobi/upload/img/a79b03b7-6b11-4316-9d98-ae06d737483f.png'
        });
    }

    handleToast(toastId) {
        this.props.dispatch(removeToast(toastId))
    }

    render() {
        const { fetchCount, toasts } = this.props.global;
        let loadingNode = null;
        let toastNode = null;

        if(fetchCount > 0){
            loadingNode = (
                <Loading
                    isOpen={true}
                    />
                )
        }

        if(toasts.length){
            let toast = toasts[0];

            toastNode = (
                <Toast
                    content={toast.content}
                    isOpen={true}
                    callback={()=>this.handleToast(toast.id)}
                    />
            )
        }

        return (
            <div className="root">
                {this.props.children}
                {loadingNode}
                {toastNode}
            </div>
        )
    }
};

function mapStateToProps(state) {
    return {
        global: state.global,
        user: state.patientInfo
    }
}

export default connect(mapStateToProps)(App);
