
var urlUtils = require('urlutils'),
    WX_AUTH_API = 'https://open.weixin.qq.com/connect/oauth2/authorize';

/**
 * 微信客户端相关的工具方法集
 * @type {Object}
 */
module.exports = {
    /**
     * 生成微信手动授权的页面链接
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-06-16T13:46:41+0800
     * @param    {String}                           link 需要包装的页面链接，若为空则为当前页面链接
     * @return   {[type]}                                [description]
     */
    generateUserInfoAuthPageLink: function(link) {
        var wxAppId = window.wx._wxAppId;

        if (!wxAppId) {
            console.log('wx appid is missing!');
            return link;
        }

        return WX_AUTH_API + '?appid=' + wxAppId + '&redirect_uri=' + encodeURIComponent(link) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    },

    /**
     * 开启页面分享
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-06-16T14:05:05+0800
     * @param    {Boolean}    isUserInfoAuth 是否开启手动授权
     * @param    {Object}     shareConfig   分享配置信息，若不配置，默认分享当前页面。字段描述如下：
     *      {
     *          title: '分享标题', // 分享标题
     *          desc: '分享描述', // 分享描述
     *          link: 'http://xxx.xx.x', // 分享链接
     *          imgUrl: 'http://image.cdn.xx.x', // 分享图标
     *          success: function(rs) {} // 分享成功后的回调方法
     *      }
     *
     * 所有所享出出去的页面链接(shareConfig.link)会拼上以下参数作为分享来源标识
     * {
     *     _userinfo_auth: 1,  // 用于node层判断授权方式
     *     _src: 'share;        // 用于前端标识由分享来源打开页面
     *     _scope: 'snsapi_userinfo'  // 标识页面请求的微信授权验证方式，用于server端登录授权
     * }
     * @return   {null}                                          [description]
     */
    openPageShare: function(isUserInfoAuth, shareConfig) {
        var that = this;

        window.wx && window.wx.ready(function(){
            var fns = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'];

            shareConfig = shareConfig || {};

            wx.showAllNonBaseMenuItem();

            // link为空时取当前页地址
            var link = shareConfig.link || window.location.href;

            for(var fnKey in fns) {
                // 配合node层的授权验证方式加上识别标识_userinfo_auth字段）
                shareConfig.link = urlUtils.fillParams({
                    _userinfo_auth: 1,
                    _src: 'share',
                    _platform: fns[fnKey],
                    _scope: 'snsapi_userinfo'
                }, link, ['code', 'state']);
                
                // 开启手动授权
                if (isUserInfoAuth) {
                    shareConfig.link = that.generateUserInfoAuthPageLink(shareConfig.link);
                }
                
                wx[fns[fnKey]](shareConfig);
            }
        });
    }
};