<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('status')->default('pending');
            $table->decimal('total_amount', 12, 2);
            $table->timestamps();

            $table->uuid('customer_id');
            $table->uuid('delivery_id')->nullable();
            // $table->uuid('payment_method_id');

            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            // $table->foreign('payment_method_id')->references('id')->on('payment_method')->onDelete('cascade');
            // $table->foreign('delivery_id')->references('id')->on('deliveries')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
