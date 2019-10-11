<?php

// hardcoded API for consumption by front-end consumers
// ...pretty REST endpoints spoofed via simple .htaccess mod_rewrite
// ...for development testing purposes only

// @todo: remove me
// ignore CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
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
