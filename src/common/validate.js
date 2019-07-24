// 验证是否整数,非必填
export function isIntegerNotMust(rule, value, callback) {
  if (!value) {
    callback()
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'))
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/
      const rsCheck = re.test(value)
      if (!rsCheck) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
  }, 1000)
}

// 验证是否正实数（包含两位小数）,非必填
export function isFloatNotMust(rule, value, callback) {
  if (!value) {
    callback()
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入数字(包含两位小数)'))
    } else {
      const re = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
      const rsCheck = re.test(value)
      if (!rsCheck) {
        callback(new Error('请输入数字(包含两位小数)'))
      } else {
        callback()
      }
    }
  }, 1000)
}

// 验证是否数字,必填不能为0
export function isIntegerMustNotZero(rule, value, callback) {
  if (!value) {
    callback(new Error('不能为空或0'))
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入非0数字'))
    } else {
      const re = /^-?\d+$/
      const rsCheck = re.test(value)
      if (!rsCheck) {
        callback(new Error('请输入整数'))
      } else {
        callback()
      }
    }
  }, 1000)
}
