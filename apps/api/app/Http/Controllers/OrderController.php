<?php

namespace App\Http\Controllers;

use App\Filters\OrderFilter;
use App\Http\Requests\BulkStoreOrderRequest;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderCollection;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = new OrderFilter();
        $queryItems = $filter->transform($request);

        if (count($queryItems) == 0) {
            return new OrderCollection(Order::paginate());
        } else {
            $orders = Order::where($queryItems)->paginate();
            return new OrderCollection($orders->appends($request->query()));
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        //
    }

    public function bulkStore(BulkStoreOrderRequest $request)
    {
        $validatedData = $request->validated();

        // Pre-cargar todos los IDs de customers existentes (1 sola consulta)
        $customerIds = collect($validatedData)->pluck('customerID')->unique();
        $existingCustomers = Customer::whereIn('id', $customerIds)->pluck('id')->toArray();

        // Procesar datos
        $ordersToInsert = [];
        $failedOrders = [];

        foreach ($validatedData as $index => $item) {
            if (!in_array($item['customerID'], $existingCustomers)) {
                $failedOrders[$index] = 'Customer no encontrado';
                continue;
            }

            $ordersToInsert[] = [
                'id' => Str::uuid(),
                'customer_id' => $item['customerID'],
                'delivery_id' => $item['deliveryID'] ?? null,
                'status' => $item['orderState'],
                'total_amount' => $item['totalAmount'],
                'created_at' => $item['createdAt'],
                'updated_at' => $item['updatedAt'],
            ];
        }

        // Insertar en lote (1 sola operación SQL)
        if (!empty($ordersToInsert)) {
            Order::insert($ordersToInsert);
        }

        return response()->json([
            'message' => 'Proceso completado',
            'successful_orders' => $ordersToInsert,
            'failed_orders' => $failedOrders,
        ], 200);
    }


    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Order $order)
    {
        if (!$request->user()->tokenCan('delete')) {
            return response()->json([
                'message' => 'No tienes permisos para realizar esta acción.'
            ], 403);
        }

        $order->delete();
        return response()->json([
            'message' => 'Orden eliminada correctamente.'
        ], 200);
    }
}
