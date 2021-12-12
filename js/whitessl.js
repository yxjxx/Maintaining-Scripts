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

function humanize_byte(num, isTotal) {
  let decimal = isTotal ? 0 : 2
  // to MiB
  num = Number(num) / 1000 / 1000
  // to GiB
  if (num > 1000) {
    num = num / 1000
    return num.toFixed(decimal) + 'G'
  } else {
    return num.toFixed(decimal) + 'M'
  }
}

$httpClient.get({
  url : url,
  headers: {
    'Content-Type': "application/json",
    'Accept': '*/*',
    'User-Agent': 'Crown/292 CFNetwork/1327.0.4 Darwin/21.2.0',
    'Accept-Language': 'zh-cn',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Cookie': read
  }
}, function(error, response, data){  
  let res = JSON.parse(data)
  let total = res['transfer_enable']
  let used = res['transfer_used']
  let reset = res['days_to_reset']
  if (!total || !used) {
    $done({
      style: "error",
      title: res['status'] + res['msg'] + "   " +nowtime(),
    });
  } else {
    $done({
      title: "流量查询: 已用 / 全部 "+ "   "+nowtime(),
      content: reset +"天后重置" + humanize_byte(used, false) + " / " + humanize_byte(total, true),
      icon: externaldrive.connected.to.line.below,
		  'icon-color':'#9a7ff7'
    });
  }  
});