<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('sign-up', [AuthController::class, 'register'])->name('auth.register');
    Route::post('sign-in', [AuthController::class, 'login'])->name('auth.login');
});

Route::middleware(['auth:sanctum'])->group(function () {
    // User profile
    Route::get('user', function (Request $request) {
        return $request->user();
    })->name('user.profile');

    // Auth (close session)
    Route::delete('logout', [AuthController::class, 'logout'])->name('auth.logout');

    Route::get('products', [ProductController::class, 'index'])->name('products.index');

    // CRUDs
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('orders', OrderController::class);

    Route::post('orders/bulk', [OrderController::class, 'bulkStore']);
});
