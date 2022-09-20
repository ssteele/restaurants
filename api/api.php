<?php

$isLocal = false !== strpos($_SERVER['HTTP_HOST'], 'shs');
if ($isLocal) {
    // ignore CORS
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
    }
}

$city = $_GET['city'] ?: 'austin';
$jsonpCallback = $_GET['callback'];

if ($city) {
    $file = 'resources/' . $city . '.json';
    if (!file_exists($file)) {
        $file = null;
    }
    $json = file_get_contents($file);
}

header('Content-Type: application/json');
echo $json;
