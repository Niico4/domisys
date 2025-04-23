<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerRequest extends FormRequest
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
            'firstName' => ['required', 'string', 'max:20'],
            'lastName' => ['required', 'string', 'max:20'],
            'phoneNumber' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'unique:customers,email'],
            'address' => ['required', 'string', 'max:60'],
            'paymentMethod' => ['required', 'string', Rule::in(['credit_card', 'cash', 'nequi'])]
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'first_name' => $this->firstName,
            'last_name' => $this->lastName,
            'phone_number' => $this->phoneNumber,
            'payment_method' => $this->paymentMethod,
        ]);
    }
}
