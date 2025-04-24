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

            if ($request->has('invitation_code')) {
                if (InvitationCode::validateCode($request->invitation_code, 'delivery')) {
                    $role = 'delivery';
                    InvitationCode::markAsUsed($request->invitation_code);
                }
            }

            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'address' => $validated['address'],
                'password' => Hash::make($validated['password']),
                'role' => $role
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('New user registered', ['user_id' => $user->id]);

            return response()->json([
                'data' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error during registration'], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        try {
            if (!Auth::attempt($request->only('email', 'password'))) {
                Log::warning('Failed login attempt', ['email' => $request->email]);
                return response()->json([
                    'message' => 'Credenciales inválidas',
                    'errors' => ['email' => ['Las credenciales proporcionadas no son correctas.']]
                ], 401);
            }

            $user = User::where('email', $request->email)->firstOrFail();
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('User logged in', ['user_id' => $user->id]);

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
            return response()->json(['message' => 'Error during login'], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            if ($request->user()) {
                $request->user()->tokens()->delete();
                Log::info('User logged out', ['user_id' => $request->user()->id]);
            }

            return response()->json(['message' => 'Se ha cerrado la sesión correctamente']);
        } catch (\Exception $e) {
            Log::error('Logout error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error during logout'], 500);
        }
    }
}
