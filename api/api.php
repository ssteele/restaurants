<?php

define('DEFAULT_CITY', 'austin');

$isLocal = false !== strpos($_SERVER['HTTP_HOST'], 'shs');
if ($isLocal) {
    // ignore CORS
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
        header('Content-Type: application/json');
    }
}

function readJsonFile($path) {
    if ($path) {
        if (!file_exists($path)) {
            $path = null;
        }
        return @file_get_contents($path);
    }
}

function returnJsonResponse($json) {
    if ($json) {
        echo $json;
    } else {
        http_response_code(500);
    }
}
