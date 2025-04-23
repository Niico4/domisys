<?php

namespace App\Filters;


class OrderFilter extends ApiFilter
{
    protected $safeParams = [
        'customerID' => ['eq'],
        'deliveryID' => ['eq'],
        'orderState' => ['eq', 'ne'],
        'totalAmount' => ['eq', 'gte', 'lte', 'gt', 'lt'],
        'createdAt' => ['eq', 'gt', 'gte', 'lt', 'lte', 'ne'],
        'updatedAt' => ['eq', 'gt', 'gte', 'lt', 'lte', 'ne'],
    ];
    protected $columnMap = [
        'customerID' => 'customer_id',
        'deliveryID' => 'delivery_id',
        'orderState' => 'status',
        'totalAmount' => 'total_amount',
        'createdAt' => 'created_at',
        'updatedAt' => 'updated_at',
    ];
    protected $operatorMap = [
        'eq' => '=',
        'lt' => '<',
        'lte' => '<=',
        'gt' => '>',
        'gte' => '>=',
        'ne' => '!='
    ];
}
