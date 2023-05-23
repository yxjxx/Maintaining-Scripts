var hostnameMatched = ($request.hostname === 'cmbchina.com');
var ssidMatched = ($network.wifi.ssid === 'Meituan');

$done({matched: (hostnameMatched && ssidMatched)});
