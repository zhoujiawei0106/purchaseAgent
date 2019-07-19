const contentPath = 'http://localhost:8088/api'

/**
 * @author zhoujiawei
 * 将null或"null"字符串置为""
 * @param obj
 * @returns
 */
function null2empty(obj) {
  if (!obj || "null" == obj)
    return "";
  for (var p in obj) {
    if (obj[p] instanceof Object) {
      obj[p] = null2empty(obj[p]);
    } else if (!obj[p] || "null" == obj[p]) {
      obj[p] = "";
    }
    if (!obj[p] || "null" == obj[p]) {
      obj[p] = "";
    }
  }
  return obj;
}

/**
 * 将null或"null"字符串置为"0"
 * @author zhoujiawei
 * @param obj
 * @returns
 */
function null2zero(obj) {
  return common.isEmpty(obj) ? "0" : obj;
}

/**
 * 判断是否为空
 * @author zhoujiawei
 * @param obj
 * @returns {Boolean}
 */
function isEmpty(obj) {
  if (obj == undefined || obj.length == 0 || obj == null) {
    return true;
  }
  return false;
}

/**
 * 判断是否不为空
 * @author zhoujiawei
 * @param obj
 * @returns
 */
function isNotEmpty(obj) {
  return !common.isEmpty(obj);
}

/**
 * 生成uuid，在grid中添加数据(addRowData方法)时没有id时使用
 * @author zhoujiawei
 * @returns
 */
function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  // 设置uuid长度32位
  for (var i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
//	    s[8] = s[13] = s[18] = s[23] = "-"; // "-"分隔，和guid相似

  var uuid = s.join("");
  return uuid;
}

/**
 * 生成日期(年月日)
 * @author zhoujiawei
 * @param regex 分隔符
 * @param count 减去的时间
 */
function systemDate(regex, count) {
  var date = new Date();
  // 年
  var year = date.getFullYear() - count;
  // 月
  var month = date.getMonth() + 1;
  // 日
  var day = date.getDate();
  // 如果月份是个位数，在月份前拼接0
  if (month.toString().length == 1) {
    month = "0" + month;
  }
  // 如果日期是个位数，在日期前拼接0
  if (day.toString().length == 1) {
    day = "0" + day;
  }
  return year + regex + month + regex + day;
}

/**
 * 空和undefined转换成空字符串
 * @author zhoujiawei
 * @param value
 * @returns {*}
 */
function changeString(value) {
  if (this.isEmpty(value)) {
    return '';
  }
  return value;
}

export default {
  contentPath,
  null2empty,
  null2zero,
  isEmpty,
  isNotEmpty,
  uuid,
  systemDate,
  changeString
}
