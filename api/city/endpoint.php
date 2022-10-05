<?php

require_once '../api.php';

define('DEFAULT_CITY', 'austin');
$city = isset($_GET['city']) ? $_GET['city'] : DEFAULT_CITY;
if ($city) {
    $path = 'resources/' . $city . '.json';
    $json = readJsonFile($path);
}

echo $json;
