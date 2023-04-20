const read = $persistentStore.read("darkssl_token") ;
const url = "https://api.darkssl.com/v1/services/me/nodes";
if (!read){
  $done({
   title: "剩余流量查询",
   style: "error",
   content: "请完善 darkssl_token 信息\n$persistentStore.write('your_cookie', 'darkssl_token') "
  })
};
function nowtime() {
  let now = new Date();
  let hour = now.getHours().toString().padStart(2, '0');
  let minute = now.getMinutes().toString().padStart(2, '0');
  let second = now.getSeconds().toString().padStart(2, '0');
  let time = hour + ":" + minute + ":" + second;
  return time;
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

function humanize_byte(num, decimal) {  
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
  let days_to_reset = Number(reset) ? Number(reset) : 1
  let remain = Number(total) - Number(used)
  let remain_per_day = remain / days_to_reset
  let date = new Date(res['expired_at'] * 1000)
  let month = date.getMonth() + 1
  let expired_at = "到期: " + date.getFullYear() + "/" + month + "/" + date.getDate()  
  let remain_str = "剩余: " + humanize_byte(remain, 2) + " | " + humanize_byte(remain_per_day, 1) + ' 每天'
  if (!total) {
    $done({
      style: "error",
      title: res['status'] + res['msg'] + "   " +nowtime(),
    });
  } else {
    $done({
      title: "用量: "+ humanize_byte(used, 2) + " | " + humanize_byte(total, 0) + "   "+nowtime(),
      content: remain_str + "\n重置: 剩余 " + reset + " 天 | " + expired_at,
      icon: 'externaldrive.connected.to.line.below',
		  'icon-color':'#9a7ff7'
    });
    
  }  
});
