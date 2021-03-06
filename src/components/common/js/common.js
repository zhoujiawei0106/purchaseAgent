const contentPath = 'http://localhost:8088/api';

/**
 * @author zhoujiawei
 * 将null或"null"字符串置为""
 * @param obj
 * @returns
 */
function null2empty(obj) {
  if (!obj || "null" == obj)
    return "";
  for (let p in obj) {
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
  return this.isEmpty(obj) ? "0" : obj;
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
  return !this.isEmpty(obj);
}

/**
 * 生成uuid，在grid中添加数据(addRowData方法)时没有id时使用
 * @author zhoujiawei
 * @returns
 */
function uuid() {
  let s = [];
  let hexDigits = "0123456789abcdef";
  // 设置uuid长度32位
  for (let i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
//	    s[8] = s[13] = s[18] = s[23] = "-"; // "-"分隔，和guid相似

  let uuid = s.join("");
  return uuid;
}

/**
 * 生成日期(年月日)
 * @author zhoujiawei
 * @param regex 分隔符
 * @param count 减去的时间
 */
function systemDate(regex, count) {
  let date = new Date();
  // 年
  let year = date.getFullYear() - count;
  // 月
  let month = date.getMonth() + 1;
  // 日
  let day = date.getDate();
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
 * 生成日期(年月日时分秒)
 * @author zhoujiawei
 * @param regex 分隔符
 * @param count 减去的时间
 */
function systemDateTime(regex, count) {
  let date = new Date();
  let dateTime = systemDate(regex, count);
  return dateTime + ' ' + date.getHours() + '：' + date.getMinutes() + '：' + date.getSeconds();
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

/**
 * 错误提示弹窗
 * @author zhoujiawei
 * @param that 当前对象
 * @param data 数据
 */
function errorAlert(that, data) {
  if (!data.flag && (isEmpty(data.code) || data.code != 412)) {
    that.$alert('系统异常，请联系管理员', '提示');
  }
}

/**
 * 错误提示信息(从上方出现)
 * @author zhoujiawei
 * @param that
 * @param message
 */
function errorMessage(that, message) {
  that.$message({
    showClose: true,
    message: message,
    type: 'error'
  });
}

/**
 * 错误提示信息(从上方出现)
 * @author zhoujiawei
 * @param that
 * @param message
 */
function selectRowMsg(that) {
  errorMessage(that, '请选择一条记录');
}

/**
 * 数据操作成功提示信息(从右边出现)
 * @author zhoujiawei
 * @param that
 * @param title
 * @param message
 */
function operateSuccess(that, title, message) {
  that.$notify({
    title: title +'成功',
    message: message,
    type: 'success',
    duration: 5000
  });
}

/**
 * 列表查询
 * @author zhoujiawei
 * @param that vue的this
 * @param url 请求后台的路径
 * @param data 查询条件
 */
function tableSearch(that, url, data) {
  that.loading = true;
  that.$axios.get(contentPath + url, {params: data}).then(function (event) {
    that.loading = false;
    if (event.data.flag) {
      that.tableData = event.data.data.list;
      // 根据返回数据量显示或隐藏分页条，并设置分页信息
      if (that.$common.isNotEmpty(that.pagination)) {
        that.pagination = true;
        // 设置当前第页数
        that.formData.page = event.data.data.pageNum;
        // 设置每页条数
        that.formData.rows = event.data.data.pageSize;
        // 设置总条数
        that.formData.total = event.data.data.total;
      } else {
        that.tableData = event.data.data;
        that.pagination = false;
      }
    } else {
      errorAlert(that, event.data);
      console.log(event.data.msg);
    }
  }).catch(function (e) {
    console.log(e);
    errorMessage(that, '系统异常,请联系管理员!');
  });
}

/**
 * 查询数据
 * @author zhoujiawei
 * @param that
 * @param url
 * @param data
 * @param message
 * @param showMsg
 */
function queryAxios(that, url, data, message, showMsg) {
  return new Promise(function (resolve) {
    that.$axios.get(contentPath + url, {params: data}).then(function (event) {
      if (event.data.flag) {
        if (showMsg) {
          operateSuccess(that, '查询', message);
        }
        resolve(event.data);
      } else {
        errorMessage(that, event.data.msg);
      }
    }).catch(function (e) {
      console.log(e);
      errorMessage(that, '系统异常,请联系管理员!');
    });
  });
}

/**
 * 新增数据
 * @author zhoujiawei
 * @param that
 * @param url
 * @param data
 * @param message
 */
function saveAxios(that, url, data, message) {
  return new Promise(function (resolve) {
    that.$axios.post(contentPath + url, that.$qs.stringify(data)).then(function (event) {
      if (event.data.flag) {
        operateSuccess(that, '新增', message);
      } else {
        errorMessage(that, event.data.msg);
      }
      resolve(event.data.flag);
    }).catch(function (e) {
      console.log(e);
      errorMessage(that, '系统异常,请联系管理员!');
    });
  })
}

/**
 * 更新数据
 * @author zhoujiawei
 * @param that
 * @param url
 * @param data
 * @param message
 */
function updateAxios(that, url, data, message) {
  return new Promise(function (resolve) {
    that.$axios.put(contentPath + url, that.$qs.stringify(data)).then(function (event) {
      if (event.data.flag) {
        that.dialogForm = false;
        operateSuccess(that, '修改', message);
      } else {
        errorMessage(that, event.data.msg);
      }
      resolve(event.data.flag);
    }).catch(function (e) {
      console.log(e);
      errorMessage(that, '系统异常,请联系管理员!');
    })
  });
}

/**
 * 删除数据
 * @author zhoujiawei
 * @param that
 * @param url
 * @param data
 * @param message
 */
function deleteAxios(that, url, data, message) {
  return new Promise(function (resolve) {
    that.$axios.delete(contentPath + url, {params: data}).then(function (event) {
      if (event.data.flag) {
        operateSuccess(that, '删除', message);
      } else {
        errorMessage(that, event.data.msg);
      }
      resolve(event.data.flag);
    }).catch(function (e) {
      console.log(e);
      errorMessage(that, '系统异常,请联系管理员!');
    });
  });
}

function exportExcel(that, title, header, entity, list) {
  if (this.isEmpty(title)) {
    errorMessage(that, '系统异常(标题为空),请联系管理员!');
    return false;
  }
  if (this.isEmpty(header)) {
    errorMessage(that, '系统异常(列抬头为空),请联系管理员!');
    return false;
  }
  if (this.isEmpty(entity)) {
    errorMessage(that, '系统异常(映射字段为空),请联系管理员!');
    return false;
  }
  if (header.length > 26 * 26) {
    errorMessage(that, '系统异常(列抬头过多),请联系管理员!');
    return false;
  }
  if (header.length != entity.length) {
    errorMessage(that, '系统异常(列抬头和映射字段数量不匹配),请联系管理员!');
    return false;
  }

  // 导出excel
  import('../../../vendor/export2excel').then(method => {
    let data = formatJson(entity, list);
    method.export_json_to_excel(header, data, title, systemDateTime('-', 0));
  });
}

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

/**
 * 校验登陆是否为手机
 * @author zhoujiawei
 * @returns {RegExpMatchArray}
 */
function isMobile() {
  let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return flag;
}

export default {
  contentPath,
  null2empty,
  null2zero,
  isEmpty,
  isNotEmpty,
  uuid,
  systemDate,
  changeString,
  errorAlert,
  errorMessage,
  selectRowMsg,
  tableSearch,
  queryAxios,
  saveAxios,
  updateAxios,
  deleteAxios,
  exportExcel,
  isMobile
}
