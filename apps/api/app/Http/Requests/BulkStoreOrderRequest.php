<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkStoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        return $user != null && $user->tokenCan('delete');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            '*.customerID' => ['required', 'uuid'],
            '*.deliveryID' => ['required', 'uuid'],
            '*.orderState' => ['required', 'string', Rule::in(['pending', 'preparing', 'delivering', 'delivered', 'cancelled'])],
            '*.totalAmount' => ['required', 'decimal:0,2', 'min:0'],
            '*.createdAt' => ['required', 'date'],
            '*.updatedAt' => ['nullable', 'date'],
        ];
    }

    protected function prepareForValidation()
    {
        $transformedData = [];

        foreach ($this->all() as $item) {
            if (!is_array($item)) {
                continue;
            }

            $transformedData[] = [
                'customerID' => $item['customerID'] ?? null,
                'deliveryID' => $item['deliveryID'] ?? null,
                'orderState' => $item['orderState'] ?? null,
                'totalAmount' => $item['totalAmount'] ?? null,
                'createdAt' => $item['createdAt'] ?? null,
                'updatedAt' => $item['updatedAt'] ?? null,
            ];
        }

        $this->merge($transformedData);
    }
}
