<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAuthRequest;
use App\Models\InvitationCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(StoreAuthRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $role = 'customer';

            if ($request->filled('invitation_code')) {
                $code = $request->invitation_code;

                if (!InvitationCode::validateCode($code, 'delivery')) {
                    return response()->json(['message' => 'El código de invitación es inválido'], 422);
                }

                $role = 'delivery';
                InvitationCode::markAsUsed($code);
            }

            $user = User::create([
                'first_name' => $validated['firstName'],
                'last_name' => $validated['lastName'],
                'email' => $validated['email'],
                'phone_number' => $validated['phoneNumber'],
                'address' => $validated['address'],
                'password' => Hash::make($validated['password']),
                'role' => $role
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'userData' => $user,
                'accessToken' => $token,
                'tokenType' => 'Bearer'
            ], 201);
        } catch (\Exception $error) {
            Log::error('Registration error', ['error' => $error->getMessage()]);
            return response()->json(['message' => 'Error durante el registro'], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        try {
            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'message' => 'Credenciales inválidas',
                    'errors' => ['email' => ['Las credenciales proporcionadas no son correctas.']]
                ], 401);
            }

            $user = User::where('email', $request->email)->firstOrFail();
            $token = $user->createToken('auth_token')->plainTextToken;


            return response()->json([
                'accessToken' => $token,
                'tokenType' => 'Bearer',
                'userData' =>  [
                    'id' => $user->id,
                    'role' => $user->role,
                    'firstName' => $user->first_name,
                    'lastName' => $user->last_name,
                    'email' => $user->email,
                    'phoneNumber' => $user->phone_number,
                    'address' => $user->address,
                    'emailVerifiedAt' => $user->email_verified_at,
                    'createdAt' => $user->created_at,
                    'updatedAt' => $user->updated_at
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Login error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error durante el inicio de sesión'], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            if ($request->user()) {
                $request->user()->tokens()->delete();
            }

            return response()->json(['message' => 'Se ha cerrado la sesión correctamente']);
        } catch (\Exception $e) {
            Log::error('Logout error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error during logout'], 500);
        }
    }
}
