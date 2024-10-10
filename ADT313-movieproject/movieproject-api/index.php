<?php
declare(strict_types=1);
//run `composer dump-autoload` to create autoload files
require __DIR__ . "/vendor/autoload.php";

set_error_handler("ErrorHandler::handleError");
set_exception_handler("ErrorHandler::handleException");

header("Content-type: application/json; charset=UTF-8");

//explode function converts the string to array
$parts = explode("/", $_SERVER["REQUEST_URI"]);

// $http_authorization = $_SERVER["HTTP_AUTHORIZATION"];

//other way of getting the autorization header
// $header = apache_request_headers();
// $http_authorization = $header["Authorization"];

//database config
$database = new Database("localhost", "movieprojectdb", "root", "");
$database->getConnection();
$user_gateway = new UserGateway($database);

$codec = new JWTCodec;

header("Access-Control-Allow-Origin: *");
error_log(print_r("--------------------------------", true));
//error_log(print_r($parts[2], true));
error_log(print_r("Part 3: " . $parts[3], true));
error_log(print_r("Part 4 franc: " . $parts[4], true));
$auth = new Auth($user_gateway, $codec);
if (($parts[3] !== 'user' && $parts[3] !== 'admin') && ($_SERVER["REQUEST_METHOD"] === "POST" || $_SERVER["REQUEST_METHOD"] === "DELETE" || $_SERVER["REQUEST_METHOD"] === "PATCH")) {
    //check access token if endpoint is not user and method are post, delete, patch
    if (!$auth->authenticateAccessToken()) {
        exit;
    }
}

switch ($parts[3]) {
    case 'admin':
        //admin endpoint
        $action = $parts[4] ?? null;
        if ($action === null) {
            http_response_code(404);
        }

        $gateway = new AdminGateway($database);

        $controller = new AdminController($gateway);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $action);
        break;

    case 'user':
        //user endpoint
        $action = $parts[4] ?? null;
        if ($action === null) {
            http_response_code(404);
        }

        $gateway = new UserGateway($database);

        $controller = new UserController($gateway);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $action);
        break;

    case 'movies':
        //movies endpoint
        $id = $parts[4] ?? null;

        $gateway = new MovieGateway($database);

        $controller = new MovieController($gateway, $auth);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;

    case 'photos':
        //photos endpoint
        $id = $parts[4] ?? null;

        $gateway = new PhotosGateway($database);

        $controller = new PhotosController($gateway, $auth);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;

    case 'videos':
        //videos endpoint
        $id = $parts[4] ?? null;

        $gateway = new VideosGateway($database);

        $controller = new VideosController($gateway, $auth);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;


    default:
        http_response_code(404);
        exit;
}