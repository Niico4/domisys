<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AdminFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid(),
            'first_name' => 'Admin',
            'last_name' => 'User',
            'phone_number' => $this->faker->phoneNumber(),
            'email' => 'admin@correo.com',
            'address' => $this->faker->streetAddress(),
            'password' => Hash::make('password1234'),
            'role' => 'admin'
        ];
    }
}
