/**
 * 格式化钱
 * @param amount {Number/String}   要格式化的数字
 * @param base   {Number}          格式化基数,默认为100
 * @returns {number}
 */
export function formatMoney(amount, base = 100) {
    return Number(amount || 0) / base;
};

/**
 * 自动为数字添加加号(负数不加)
 * @param num
 * @return  String
 */
export function addPlus (num) {
    num = Number(num || 0);

    if (num > 0) {
        return '+' + num;
    }

    return String(num);
};

/**
 * 格格式输出日期串
 * @param date      {Number/Date}   要格式化的日期
 * @param formatStr {String}        格式串(yMdHmsqS)
 * @returns {*|string}
 */
export function formatDate(date, formatStr) {

    if (!date) {
        return '';
    }

    var format = formatStr || 'yyyy-MM-dd';

    if ('number' === typeof date) {
        date = new Date(date);
    }

    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;

};

/**
 * 身份证号码校验
 * @param    {[type]}                cardNo [description]
 * @return   {[type]}                [description]
 * @datetime 2016-09-20T00:04:34+080
 * @author wangxiao<i@muyao.me>
 */
export function checkID(cardNo) {
    var info = {
        isTrue: false, // 身份证号是否有效。默认为 false
        year: null, // 出生年。默认为null
        month: null, // 出生月。默认为null
        day: null, // 出生日。默认为null
        isMale: false, // 是否为男性。默认false
        isFemale: false // 是否为女性。默认false
    };

    if (!cardNo || 18 != cardNo.length) {
        info.isTrue = false;
        return false;
    }

    var year = cardNo.substring(6, 10);
    var month = cardNo.substring(10, 12);
    var day = cardNo.substring(12, 14);
    var p = cardNo.substring(14, 17);
    var birthday = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题
    if (birthday.getFullYear() != parseFloat(year) ||
        birthday.getMonth() != parseFloat(month) - 1 ||
        birthday.getDate() != parseFloat(day)) {
        info.isTrue = false;
        return false;
    }

    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
    var Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X

    // 验证校验位
    var sum = 0; // 声明加权求和变量
    var _cardNo = cardNo.split("");

    if (_cardNo[17].toLowerCase() == 'x') {
        _cardNo[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
    }
    for (var i = 0; i < 17; i++) {
        sum += Wi[i] * _cardNo[i]; // 加权求和
    }
    var i = sum % 11; // 得到验证码所位置

    if (_cardNo[17] != Y[i]) {
        return false;
    }

    info.isTrue = true;
    info.year = birthday.getFullYear();
    info.month = birthday.getMonth() + 1;
    info.day = birthday.getDate();

    if (p % 2 == 0) {
        info.isFemale = true;
        info.isMale = false;
    } else {
        info.isFemale = false;
        info.isMale = true;
    }
    return true;
}

/**
 * 从右至左混淆number的指定len位数(以*填充)
 * @param   {Number/String}   id
 * @param   {Number}          len 混淆的数字长度
 * @return  {string}
 */
export function mixId (id, len) {
    if (!id) {
        return '';
    }
    let idStr = String(id);
    len = len || 0;
    return idStr.substring(0, idStr.length - len) + ''.padStart(len, '*');
}

/**
 * 计算剩余天数
 * @param {Number/Date}   date      起始时间
 * @param {Number}        period    总天数
 * @returns {Number} 剩余天数
 */
export function dayLeft (date, period) {
    var timeNow = parseInt(new Date().getTime()),
        beginDate = 'object' === typeof date ? date: new Date(date),
        d = (timeNow - parseInt(beginDate.getTime())) / 1000,
        diff_days = Math.ceil(d / 86400);

    return period > diff_days ? period - diff_days : 0;
}
