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

        $bulkData = array_map(function ($item) {
            $customerExists = Customer::where('id', $item['customerID'])->exists();
            // $deliveryExists = Delivery::where('id', $item['deliveryID'])->exists();

            if (!$customerExists) {
                return null;
            }

            // Generar el UUID para cada orden
            $item['id'] = Str::uuid();

            return [
                'id' => $item['id'],
                'customer_id' => $item['customerID'],
                'delivery_id' => $item['deliveryID'],
                'status' => $item['orderState'],
                'total_amount' => $item['totalAmount'],
                'created_at' => $item['createdAt'],
                'updated_at' => $item['updatedAt'] ?? null
            ];
        }, $validatedData);

        // Filtrar elementos nulos (si alguno no pasó la validación)
        $bulkData = array_filter($bulkData);

        // Inserción masiva
        if (count($bulkData) > 0) {
            Order::insert($bulkData);
        }
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
