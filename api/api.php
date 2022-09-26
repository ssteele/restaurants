<?php

define('DEFAULT_CITY', 'austin');

$isLocal = false !== strpos($_SERVER['HTTP_HOST'], 'shs');
if ($isLocal) {
    // ignore CORS
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
    }
}

$city = isset($_GET['city']) ? $_GET['city'] : DEFAULT_CITY;
if ($city) {
    $file = 'resources/' . $city . '.json';
    if (!file_exists($file)) {
        $file = null;
    }
    $json = @file_get_contents($file);
}

header('Content-Type: application/json');
echo $json;
