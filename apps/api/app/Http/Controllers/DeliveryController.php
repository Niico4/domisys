<?php

namespace App\Http\Controllers;

use App\Filters\DeliveryFilter;
use App\Models\Delivery;
use App\Http\Requests\StoreDeliveryRequest;
use App\Http\Requests\UpdateDeliveryRequest;
use App\Http\Resources\DeliveryCollection;
use App\Http\Resources\DeliveryResource;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    /**
     * Display a listing of deliveries (with optional filters and orders inclusion).
     */
    public function index(Request $request)
    {
        $filter = new DeliveryFilter();
        $queryItems = $filter->transform($request);

        $includeOrders = $request->query('includeOrders');

        $deliveries = Delivery::where($queryItems);

        if ($includeOrders) {
            $deliveries = $deliveries->with('orders');
        }

        return new DeliveryCollection(
            $deliveries->paginate()->appends($request->query())
        );
    }

    /**
     * Store a newly created delivery in storage.
     */
    public function store(StoreDeliveryRequest $request)
    {
        $delivery = Delivery::create($request->validated());
        return new DeliveryResource($delivery);
    }

    /**
     * Display the specified delivery.
     */
    public function show(Delivery $delivery)
    {
        $includeOrders = request()->query('includeOrders');

        return $includeOrders
            ? new DeliveryResource($delivery->loadMissing('orders'))
            : new DeliveryResource($delivery);
    }

    /**
     * Update the specified delivery in storage.
     */
    public function update(UpdateDeliveryRequest $request, Delivery $delivery)
    {
        $delivery->update($request->validated());
        return new DeliveryResource($delivery);
    }

    /**
     * Remove the specified delivery from storage.
     */
    public function destroy(Request $request, Delivery $delivery)
    {
        if (!$request->user()->tokenCan('delete')) {
            return response()->json([
                'message' => 'No autorizado para eliminar repartidores'
            ], 403);
        }

        $delivery->delete();
        return response()->json([
            'message' => 'Repartidor eliminado correctamente'
        ], 200);
    }
}
