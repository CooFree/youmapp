import Config from '../config';
import MemberState from './memberState';
import cmd5 from '../modules/crypto-js/md5';
import regeneratorRuntime from '../modules/regenerator-runtime/runtime';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const navigateRule = (rule) => {
  let url;
  if (rule.name && rule.name.length > 0) {
    let ruleName = rule.name.toLowerCase();
    if (ruleName === 'productDetail'.toLowerCase()) {
      if (!adlog) {
        adlog = rule.location;
      }
      url = '/product/productDetail?prod_id=' + rule.prod_id + (adlog && adlog.length > 0 ? '&adlog=' + adlog : '');
    }
    else if (ruleName === 'productList'.toLowerCase()) {
      url = '/product/productList?prod_classid=' + rule.class_id + '&prod_brand=' + rule.brand;
    }
    else if (ruleName === 'productSearch'.toLowerCase()) {
      url = '/product/productSearch?keyword=' + encodeURIComponent(rule.keyword);
    }
    else if (ruleName === 'vproductList'.toLowerCase()) {
      url = '/product/vproductList?prod_classid=' + rule.class_id;
    }
    else if (ruleName === 'topicProductList'.toLowerCase()) {
      url = '/product/topicProductList?prod_classid=' + rule.class_id + '&prefer_id=' + rule.prefer_id;
    }
    else if (ruleName === 'scoreExchange'.toLowerCase()) {
      url = '/scoreExch?ticket_id=' + rule.ticket_activity_id;
    }
  }
  if (url) {
    wx.navigateTo({ url });
  }
}

const fetch = (url, options) => {
  options = options || {};
  return new Promise(function (resolve, reject) {
    wx.request({
      url,
      method: options.method || 'GET',
      data: options.body || {},
      header: options.headers || { 'content-type': 'application/json' },
      dataType: options.dataType || 'json',
      success: function (res) {
        resolve(res.data);
      },
      fail: reject
    });
  });
}

const parseInt = (s) => {
  let num = parseInt(s, 0);
  if (isNaN(num) === true) {
    return 0;
  }
  else {
    return num;
  }
}

const parseFloat = (s) => {
  let num = parseFloat(s, 0);
  if (isNaN(num) === true) {
    return 0;
  }
  else {
    return num;
  }
}

const getPageCount = (record_count, page_size) => {
  if (page_size === 0)
    return 0;
  var page_count = 1;
  if (record_count < page_size)
    page_count = 1;
  else if (record_count % page_size === 0)
    page_count = Math.floor(record_count / page_size);
  else
    page_count = Math.floor(record_count / page_size) + 1;
  return page_count;
}

const isValidEmail = (email) => {
  var regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/;
  return regex.test(email);
}

const isValidUsername = (username) => {
  var regex = /^([A-Za-z0-9_])+$/;
  return regex.test(username);
}

const jsonToFormData = (json, noparams) => {
  var formData = '';
  for (var name in json) {
    if (noparams !== undefined && noparams.indexOf(name + ',') > -1) {
      continue;
    }

    var value = json[name];
    if (value === true) {
      value = '1';
    }
    else if (value === false) {
      value = '0';
    }
    formData += '&' + name + '=' + value;
  }
  if (formData.length > 0) {
    return formData.substr(1);
  }
  else {
    return formData;
  }
}
//过滤掉url参数坏字符
const filterUrlBad = (urlStr) => {
  if (urlStr) {
    const badArray = ['&', '=', '?', ':', '/', '#'];
    for (let bad of badArray) {
      urlStr = urlStr.replace(bad, '');
    }
  }
  return urlStr;
}

const md5 = (str) => {
  let bytes = cmd5(str);
  return bytes.toString();
}

const decodeURI = (uri) => {
  if (uri && uri.length > 0) {
    return decodeURIComponent(uri.toString().replace(/\+/g, '%20'));
  }
  return '';
}

const httpsURI = (uri) => {
  if (uri && uri.length > 0) {
    return uri.replace('http://', 'https://');
  }
  return '';
}

const timeDiff = (time1, time2, format) => {
  if (time1 < time2) {
    return 0;
  }
  if (format) {
    format = format.toLowerCase();
    if (format === 'd') {
      return (time1 - time2) / (24 * 60 * 60 * 1000);
    }
    else if (format === 'h') {
      return (time1 - time2) / (60 * 60 * 1000);
    }
    else if (format === 'm') {
      return (time1 - time2) / (60 * 1000);
    }
    else if (format === 's') {
      return (time1 - time2) / 1000;
    }
  }
  return (time1 - time2);
}

const timeAdd = (time, num, format) => {
  if (format) {
    format = format.toLowerCase();
    if (format === 'd') {
      return new Date(time.getTime() + (num * 24 * 60 * 60 * 1000));
    }
    else if (format === 'h') {
      return new Date(time.getTime() + (num * 60 * 60 * 1000));
    }
    else if (format === 'm') {
      return new Date(time.getTime() + (num * 60 * 1000));
    }
    else if (format === 's') {
      return new Date(time.getTime() + (num * 1000));
    }
  }
  return new Date(time.getTime() + (num * 1000));
}

const toFixed = (number, fractionDigits) => {
  if (number !== undefined) {
    let numberStr = number.toString();
    if (fractionDigits) {
      return parseFloat(numberStr).toFixed(fractionDigits);
    }
    else {
      return numberStr;
    }
  }
}

const timing = (seconds) => {
  if (seconds > 0) {
    let time_distance = seconds;
    let int_day = Math.floor(time_distance / 86400);
    time_distance -= int_day * 86400;
    let int_hour = Math.floor(time_distance / 3600);
    time_distance -= int_hour * 3600;
    let int_minute = Math.floor(time_distance / 60);
    time_distance -= int_minute * 60;
    let int_second = time_distance;
    let time = {};
    time.day = int_day;
    time.hour = int_hour;
    time.minute = int_minute;
    time.second = int_second;
    return time;
  }
  else {
    return { day: '0', hour: '0', minute: '0', second: '0' };
  }
}
const cloneJSON = (json) => {
  var JSON_SERIALIZE_FIX = { PREFIX: "[[JSON_FUN_PREFIX_", SUFFIX: "_JSON_FUN_SUFFIX]]" };
  var sobj = JSON.stringify(json, function (key, value) {
    if (typeof value === 'function') {
      return JSON_SERIALIZE_FIX.PREFIX + value.toString() + JSON_SERIALIZE_FIX.SUFFIX;
    }
    return value;
  });
  return JSON.parse(sobj, function (key, value) {
    if (typeof value === 'string' &&
      value.indexOf(JSON_SERIALIZE_FIX.SUFFIX) > 0 && value.indexOf(JSON_SERIALIZE_FIX.PREFIX) === 0) {
      let evel_str = "(" + value.replace(JSON_SERIALIZE_FIX.PREFIX, "").replace(JSON_SERIALIZE_FIX.SUFFIX, "") + ")";
      return eval(evel_str);
    }
    return value;
  }) || {};
}

module.exports = {
  formatTime,
  navigateRule,
  fetch,
  parseInt,
  parseFloat,
  getPageCount,
  isValidEmail,
  isValidUsername,
  cloneJSON,
  timing,
  toFixed,
  timeAdd,
  timeDiff,
  httpsURI,
  decodeURI,
  md5,
  filterUrlBad,
  jsonToFormData
}
