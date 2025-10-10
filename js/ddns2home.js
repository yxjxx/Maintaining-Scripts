if ($network.wifi.ssid === 'CU_pitaya') {
    $done({ address: '192.168.0.101' })
} else if ($network.wifi.ssid === 'Inspire Creativity') {
    $done({ server: '223.5.5.5' })
} else {
    $done({})
}
