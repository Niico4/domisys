<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $order_state = $this->faker->randomElement(['pending', 'preparing', 'delivering', 'delivered', 'cancelled']);

        return [
            'id' => $this->faker->uuid(),
            'customer_id' => Customer::factory(),
            'delivery_id' => null,
            'total_amount' => $this->faker->randomFloat(2, 10, 10000),
            'status' => $order_state,
            'created_at' => $this->faker->dateTime(),
        ];
    }
}
