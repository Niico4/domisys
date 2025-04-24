<?php

namespace App\Http\Controllers;

use App\Models\InvitationCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InvitationCodeController extends Controller
{
    public function index()
    {
        $product = InvitationCode::all();

        return $product;
    }

    public function generateDeliveryCode(Request $request): JsonResponse
    {
        try {

            if (!$request->user()->isAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $code = InvitationCode::generateCode('delivery');

            return response()->json([
                'message' => 'Código generado con éxito',
                'code' => $code
            ]);
        } catch (\Exception $error) {
            Log::error('Error al generar el código de repartidor', ['error' => $error->getMessage()]);
            return response()->json([
                'message' => 'Error generating code',
                500
            ]);
        }
    }
}
