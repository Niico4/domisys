<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customer::factory()
            ->count(25)
            ->hasOrders(10)
            ->create();
        Customer::factory()
            ->count(100)
            ->hasOrders(4)
            ->create();
        Customer::factory()
            ->count(50)
            ->hasOrders(1)
            ->create();
        Customer::factory()
            ->count(5)
            ->create();
    }
}
