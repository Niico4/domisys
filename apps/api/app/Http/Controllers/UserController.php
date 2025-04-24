<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|nullable',
            'lastName' => 'sometimes|string|nullable',
            'phoneNumber' => 'sometimes|string|nullable',
            'address' => 'sometimes|string|nullable',
        ]);

        $updateData = [];

        if ($request->has('name')) {
            $updateData['first_name'] = $validated['name'] ?? $user->first_name;
        }

        if ($request->has('lastName')) {
            $updateData['last_name'] = $validated['lastName'] ?? $user->last_name;
        }

        if ($request->has('phoneNumber')) {
            $updateData['phone_number'] = $validated['phoneNumber'] ?? $user->phone_number;
        }

        if ($request->has('address')) {
            $updateData['address'] = $validated['address'] ?? $user->address;
        }

        if (!empty($updateData)) {
            $user->update($updateData);
        }

        return response()->json($user);
    }
}
