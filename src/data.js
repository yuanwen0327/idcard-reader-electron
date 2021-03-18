const Iconv  = require('iconv').Iconv;
const iconv = new Iconv('GBK', 'UTF-8');

function makeData(num = 192){
    let data = Buffer.alloc(num);
    data.fill(0)
    data.write("", 0, "utf-8");
    return data
}

function data2String(data){
    return iconv.convert(data).toString().replace(/\x00/g,'')
}

module.exports = {
    makeData,
    data2String
}