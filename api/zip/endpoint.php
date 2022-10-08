<?php

require_once '../api.php';

$zip = isset($_GET['zip']) ? $_GET['zip'] : DEFAULT_ZIP;
if ($zip) {
    $path = 'resources/' . $zip . '.json';
    $json = readJsonFile($path);
}

returnJsonResponse($json);
