if ($network.wifi.ssid === 'CU_pitaya') {
    $done({ address: '192.168.0.100' })
} else {
    $done({})
}
