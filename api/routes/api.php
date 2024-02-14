<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);

});

Route::group([
    'middleware' => 'auth',
    'prefix' => 'v1/customers'
], function ($router) {

    Route::get('/list', [CustomerController::class, 'index']);
    Route::post('/get-list', [CustomerController::class, 'getCustomerList']);
    Route::post('/', [CustomerController::class, 'store']);
    Route::get('/{id}', [CustomerController::class, 'show']);
    Route::put('/{id}', [CustomerController::class, 'update']);
    Route::delete('/{id}', [CustomerController::class, 'destroy']);

});

Route::group([
    'middleware' => 'auth',
    'prefix' => 'v1/products'
], function ($router) {

    Route::get('/list', [ProductController::class, 'index']);
    Route::get('/categories', [ProductController::class, 'categories']);
    Route::post('/get-list', [ProductController::class, 'getProductList']);
    Route::post('/', [ProductController::class, 'store']);
    Route::post('/{id}', [ProductController::class, 'update']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);
    Route::get('/{id}', [ProductController::class, 'show']);

});


Route::group([
    'middleware' => 'auth',
    'prefix' => 'v1/orders'
], function ($router) {

    Route::get('/list', [OrderController::class, 'index']);
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/{id}', [OrderController::class, 'show']);

});
