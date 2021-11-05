/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * parseTime-格式化时间
 * @param {(Object|string|number)} time 时间戳或者实践对象
 * @param {string} cFormat 格式 默认是{y}-{m}-{d} {h}:{i}:{s}
 * @returns {string | null} 2021-05-12 17:30:21
 */
 export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 将时间转换成多久之前的格式
 * @param {number} time  时间戳或者实践对象
 * @param {string} option 第二个参数表示时间格式
 * @returns {string}  
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @purpose 获取?后面的地址栏参数，返回对象形式
 * 例如：https://www.baidu.com/s?ie=utf-8&f=8
 * @param {string} url
 * @returns {Object}
 * {
 *   ie:'utf-8',
 *   f:'8',
 * }
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  // lastIndexOf() 从右向左查找某个字符在字符串中最后一次出现的位置
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @purpose 判断字符串的字节长度，英文半角占1，中文占3，英文全角占3
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @purpose 过滤稀疏数组(删除数组中的空元素)
 * @param {Array} actual 数组
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @purpose json数组转成字符串并用&符号拼接
 * @param {Object} json
 *  jsonType : {
 *   a: *,
 *   b: *
 *  }
 * @returns {Array}  
 * StringType: a=*&b=*;
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @purpose js分割url字符串成为对象
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @purpose 将html代码转成text文本
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @purpose 合并两个对象，使最后一个对象优先
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @purpose  切换某个元素的class类名
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @purpose 日期转换成三个月前的时间戳或者当前时间的中国标准时间的格式
 * 3600 * 1000 * 24 表示一天
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @purpose  防抖
 * @param {Function} func 触发的函数
 * @param {number} wait   间隔时间
 * @param {boolean} immediate 是否立即执行 immediate 为true，debounce会在wait时间间隔的开始时立即调用这个函数
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * @purpose 节流
 * @param {function} fn         触发的函数
 * @param {number} interval     间隔时间
 */
export function throttle(fn, interval) {
  var last;
  var timer;
  var interval = interval || 200;
  return function () {
    var th = this;
    var args = arguments;
    var now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(th, args);
      }, interval);
    } else {
      last = now;
      fn.apply(th, args);
    }
  }
}

/**
 * 这只是深度复制的一个简单版本
 * 有很多边缘案例
 * 如果你想使用一个完美的深度拷贝，可以使用lodash的 lodash's _.cloneDeep
 * @purpose 深拷贝(深度复制一个数组对象) 这是通过递归的方法
 * @param {Object} source 源对象
 * @returns {Object} 返回新对象
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  // 判断复制的目标是数组还是对象
  const targetObj = source.constructor === Array ? [] : {}
  // 遍历目标
  Object.keys(source).forEach(keys => {
    // 如果值是对象，就递归一下
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      // 如果不是，就直接赋值
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @purpose ES6 Set去重数组去重
 * @缺点  无法去掉“{}”空对象
 * @param {Array} arr 数组
 * @returns {Array} 新数组
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @purpose for嵌套for，然后splice去重
 * @缺点  NaN和{}没有去重，两个null直接消失了
 * @param {Array} arr 数组
 * @returns {Array}   新数组
 */
export function uniqueArr1(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) { //第一个等同于第二个，splice方法删除第二个
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;

}

/**
 * @purpose indexOf数组去重
 * @缺点  NaN和{}没有去重
 * @param {Array} arr 数组
 * @returns {Array} newArr  新数组
 */
export function uniqueArr2(arr) {
  var newArr = []
  arr.map(function (v) {
    if (newArr.indexOf(v) === -1) {
      newArr.push(v)
    }
  })
  return newArr
}

/**
 * @purpose filter方法数组去重
 * @param {Array} arr 数组
 * @returns {Array} temp  新数组
 */
export function uniqueArr3(arr) {
  let temp = [];
  temp = arr.filter(function (element, index, self) {
    //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    return self.indexOf(element) === index;
  });
  return temp;
}


/**
 * @purpose sort()方法数组去重
 * @缺点  NaN和{}没有去重
 * @param {Array} arr 数组
 * @returns {Array}   新数组
 */
export  function uniqueArr4(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return;
    }
    arr = arr.sort()
    var NewArray= [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i-1]) {
          NewArray.push(arr[i]);
        }
    }
    return NewArray;
}


/**
 * @purpose includes数组去重
 * @缺点  {}没有去重
 * @param {Array} arr 数组
 * @returns {Array}   新数组
 */
export  function uniqueArr5(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return;
    }
    arr = arr.sort()
    var NewArray= [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i-1]) {
          NewArray.push(arr[i]);
        }
    }
    return NewArray;
}


/**
 * @purpose hasOwnProperty 数组去重
 * @优点  所有的都去重了
 * @param {Array} arr 数组
 * @returns {Array}   新数组
 */
export function uniqueArr6(arr) {
    var obj = {};
    return arr.filter(function(item, index, arr){
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}


/**
 * @purpose Map数据结构去重 数组去重
 * @param {Array} arr 数组
 * @returns {Array}   新数组
 */
export function uniqueArr7(arr) {
  let map = new Map();
  let array = new Array();  // 数组用于返回结果
  for (let i = 0; i < arr.length; i++) {
    if(map.has(arr[i])) {  // 如果有该key值
      map.set(arr[i], true); 
    } else { 
      map.set(arr[i], false);   // 如果没有该key值
      array.push(arr[i]);
    }
  } 
  return array ;
}


/**
 * @purpose reduce+includes 数组去重
 * @param {Array} arr 数组
 * @returns {Array}   新数组
 */
export function uniqueArr8(arr){
    return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
}

/**
 * @purpose [...new Set(arr)] 去重
 * @param {Array} arr 数组
 * @returns {Array}   新数组
 */
export function uniqueArr9(arr){
    return [...new Set(arr)] 
}


/**
 * @purpose 创建唯一字符串
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}


/**
 * Check if an element has a class
 * @purpose 检查元素是否有类
 * @param {HTMLElement} elm  html元素
 * @param {string} cls 类名
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @purpose 将类添加到元素
 * @param {HTMLElement} elm html元素
 * @param {string} cls 类名
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @purpose  从元素中删除类
 * @param {HTMLElement} elm html元素
 * @param {string} cls 类名
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
