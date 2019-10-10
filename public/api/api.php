<?php

// hardcoded API for consumption by front-end consumers
// ...pretty REST endpoints spoofed via simple .htaccess mod_rewrite
// ...for development testing purposes only

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
if ($jsonpCallback) {
    echo $jsonpCallback . '(' . trim($json) . ')';
} else {
    echo $json;
}
