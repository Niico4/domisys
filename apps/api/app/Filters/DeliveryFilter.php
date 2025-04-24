<?php

namespace App\Filters;


class DeliveryFilter extends ApiFilter
{
    protected $safeParams = [
        'firstName' => ['eq'],
        'lastName' => ['eq'],
        'phoneNumber' => ['eq', 'gte', 'lte'],
        'email' => ['eq'],
        'address' => ['eq'],
    ];
    protected $columnMap = [
        'firstName' => 'first_name',
        'lastName' => 'last_name',
        'phoneNumber' => 'phone_number',
    ];
    protected $operatorMap = [
        'eq' => '=',
        'lt' => '<',
        'lte' => '<=',
        'gt' => '>',
        'gte' => '>=',
    ];
}
