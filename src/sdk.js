const ffi = require('ffi-napi')
const path = require('path')
const fs = require("fs")

const { makeData, data2String } = require('./data')
let stringPointer = 'char *';

const sdk = ffi.Library(path.resolve(__dirname, '../bin/Sdtapi.dll'), {
  'InitComm': ['int', ['int']],
  'Authenticate': ['int', []],
  'CardOn': ['int', []],
  'ReadBaseInfos': ['int', [stringPointer, stringPointer, stringPointer, stringPointer, stringPointer, stringPointer, stringPointer, stringPointer, stringPointer]],
  'CloseComm': ['int', []]
})

let connectPort = null

function init() {
  let port = 1001
  for (let index = 0; index < 10; index++) {
    const res = sdk.InitComm(port + index)
    // console.log('initRes', res , typeof res)
    if (res === 1) {
      console.log('设备连接成功，端口为', port + index)
      connectPort = port + index
      return
    }
  }
  console.log('设备连接失败')
}

function close() {
  if (!connectPort) {
    console.log('没有连接中的端口')
    return
  }
  const res = sdk.CloseComm()
  // console.log('initRes', res , typeof res)
  if (res === 1) {
    connectPort = null
    console.log('端口关闭成功')
  } else if (res === -1) {
    console.log('端口未打开')
  } else {
    console.log('端口关闭失败')
  }
}

function auth() {
  const res = sdk.Authenticate()
  console.log(res)
  if (res === 1) {
    console.log('卡认证成功')
    return true
  } else {
    console.log('卡认证失败')
    return false
  }
}

function cardOn() {
  const res = sdk.CardOn()
  if (res === 1) {
    console.log('有身份证')
    return true
  } else {
    console.log('无身份证')
    return false
  }
}

function read() {
  let name = makeData(192);
  let gender = makeData(192);
  let folk = makeData(192);
  let birthDay = makeData(192);
  let code = makeData(192);
  let address = makeData(192);
  let agency = makeData(192);
  let expireStart = makeData(192);
  let expireEnd = makeData(192);

  const res = sdk.ReadBaseInfos(name, gender, folk, birthDay, code, address, agency, expireStart, expireEnd)

  console.log(res)

  if (res === 1) {
    const obj = {
      name: data2String(name),
      gender: data2String(gender),
      folk: data2String(folk),
      birthDay: data2String(birthDay),
      code: data2String(code),
      address: data2String(address),
      agency: data2String(agency),
      expireStart: data2String(expireStart),
      expireEnd: data2String(expireEnd)
    }
    
    const imageData = fs.readFileSync(path.resolve(__dirname,'../bin/photo.bmp'))
    obj.photo = "data:image/bmp;base64," + imageData.toString('base64')
    console.log(obj)
    return obj
  }
}

module.exports = {
  init,
  auth,
  close,
  cardOn,
  read
}
