<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
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
            'product_name' => $this->faker->word(),
            'stock' => $this->faker->randomNumber(5),
            'price' => $this->faker->randomFloat(2, 10, 10000),
            'category' => $this->faker->word(),
            'measure' => $this->faker->word(),
        ];
    }
}
