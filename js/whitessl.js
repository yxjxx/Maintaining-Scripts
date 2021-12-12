const read = $persistentStore.read("darkssl_token") ;
const url = "https://api.darkssl.com/v1/services/me/nodes";
if (!read){
  $done({
   title: "剩余流量查询",
   style: "error",
   content: "请在完善 darkssl_token 信息\n$persistentStore.write('your_cookie', 'darkssl_token') "
  })
};
function nowtime(){
 let now = new Date();
 let time = now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
 return time
}
var dict = {
  "url": url,
  headers: {
    'Host': 'api.darkssl.com',
    'Accept': '*/*',
    'User-Agent': 'Crown/292 CFNetwork/1327.0.4 Darwin/21.2.0',
    'Accept-Language': 'zh-cn',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Cookie': read
  }
}

function humanize_byte(num) {
  // to MiB
  num = Number(num) / 1000 / 1000
  // to GiB
  if (num > 1000) {
    num = num / 1000
    return num.toFixed(1) + 'G'
  } else {
    return num.toFixed(1) + 'M'
  }
}

$httpClient.get(dict, function(error, response, data){
  let res = JSON.parse(data)
  let total = res['transfer_enable']
  let used = res['transfer_used']
  if (!total || !used) {
    $done({
      style: "error",
      title: res['status'] + res['msg'] + "   " +nowtime(),
    });
  } else {
    $done({
      title: "流量查询: 已用 / 全部 "+ "   "+nowtime(),
      content: humanize_byte(used) + " / " + humanize_byte(total)
    });
  }  
});