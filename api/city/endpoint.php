<?php

require_once '../api.php';

$city = isset($_GET['city']) ? $_GET['city'] : DEFAULT_CITY;
if ($city) {
    $path = 'resources/' . $city . '.json';
    $json = readJsonFile($path);
}

echo $json;
