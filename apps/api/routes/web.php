<?php

// use App\Models\User;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Route;

// Route::middleware('auth:sanctum')->get('/setup', function () {
//     $credentials = [
//         'email' => 'admin@admin.com',
//         'password' => '123456Aa'
//     ];

//     if (!Auth::attempt($credentials)) {
//         $user = new User();
//         $user->name = 'Admin';
//         $user->email = $credentials['email'];
//         $user->password = Hash::make($credentials['password']);
//         $user->save();
//     }

//     if (Auth::attempt($credentials)) {
//         $user = Auth::user();
//         $rolAdmin = $user->createToken(name:'admin', abilities:['create', 'update', 'delete']);
//         $rolDelivery = $user->createToken(name:'delivery', abilities:['update']);
//         $rolCustomer = $user->createToken(name:'customer');

//         return [
//             'admin' => $rolAdmin->plainTextToken,
//             'delivery' => $rolDelivery->plainTextToken,
//             'customer' => $rolCustomer->plainTextToken,
//         ];
//     };
// });

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::get('/setup', function () {
    $credentials = [
        'email' => 'admin@admin.com',
        'password' => '123456Aa'
    ];

    //   Crear usuario admin si no existe
    if (!Auth::attempt($credentials)) {
        $user = User::create([
            'name' => 'Admin',
            'email' => $credentials['email'],
            'password' => Hash::make($credentials['password'])
        ]);
    } else {
        $user = Auth::user();
    }

    //   Eliminar tokens existentes para evitar duplicados
    $user->tokens()->delete();

    //   Crear nuevos tokens con habilidades
    $adminToken = $user->createToken(
        name: 'admin-token',
        abilities: ['create', 'update', 'delete']
    );

    $deliveryToken = $user->createToken(
        name: 'delivery-token',
        abilities: ['update']
    );

    $customerToken = $user->createToken(
        name: 'customer-token',
        abilities: ['read']
    );

    return response()->json([
        'admin' => $adminToken->plainTextToken,
        'delivery' => $deliveryToken->plainTextToken,
        'customer' => $customerToken->plainTextToken,
        'message' => 'Tokens generados exitosamente'
    ]);
});
