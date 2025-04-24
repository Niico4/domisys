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
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            '*.customerID' => ['required', 'uuid', 'exists:customers,id'],
            '*.deliveryID' => ['nullable', 'uuid', 'exists:deliveries,id'],
            '*.orderState' => ['required', 'string', Rule::in(['pending', 'preparing', 'delivering', 'delivered', 'cancelled'])],
            '*.totalAmount' => ['required', 'decimal:0,2', 'min:0'],
            '*.createdAt' => ['nullable', 'date', 'before_or_equal:now'],
            '*.updatedAt' => ['nullable', 'date', 'after_or_equal:*.createdAt'],
        ];
    }

    protected function prepareForValidation()
    {
        $data = [];

        foreach ($this->all() as $item) {
            $data[] = [
                'customerID' => $item['customerID'] ?? null,
                'deliveryID' => $item['deliveryID'] ?? null,
                'orderState' => $item['orderState'] ?? null,
                'totalAmount' => $item['totalAmount'] ?? null,
                'createdAt' => $item['createdAt'] ?? now()->toDateTimeString(),
                'updatedAt' => $item['updatedAt'] ?? now()->toDateTimeString(),
            ];
        }

        $this->merge($data);
    }
}
