<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
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
        $method = $this->method();
        if ($method == 'PUT') {
            return [
                'firstName' => ['required', 'string', 'max:20'],
                'lastName' => ['required', 'string', 'max:20'],
                'phoneNumber' => ['required', 'string', 'max:20'],
                'email' => [
                    'required',
                    'email',
                    Rule::unique('customers', 'email')->ignore($this->customer)
                ],
                'address' => ['required', 'string', 'max:60'],
                'paymentMethod' => ['required', 'string', Rule::in(['credit_card', 'cash', 'nequi'])]
            ];
        } else {
            return [
                'firstName' => ['sometimes', 'string', 'max:20'],
                'lastName' => ['sometimes', 'string', 'max:20'],
                'phoneNumber' => ['sometimes', 'string', 'max:20'],
                'email' => [
                    'sometimes',
                    'email',
                    Rule::unique('customers', 'email')->ignore($this->customer)
                ],
                'address' => ['sometimes', 'string', 'max:60'],
                'paymentMethod' => ['sometimes', 'string', Rule::in(['credit_card', 'cash', 'nequi'])]
            ];
        }
    }

    protected function prepareForValidation()
    {
        if ($this->firstName || $this->lastName || $this->phoneNumber || $this->paymentMethod) {
            $this->merge([
                'first_name' => $this->firstName,
                'last_name' => $this->lastName,
                'phone_number' => $this->phoneNumber,
                'payment_method' => $this->paymentMethod,
            ]);
        }
    }
}
