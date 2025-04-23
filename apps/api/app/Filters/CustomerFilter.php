<?php

namespace App\Filters;


class CustomerFilter extends ApiFilter
{
    protected $safeParams = [
        'firstName' => ['eq'],
        'lastName' => ['eq'],
        'phoneNumber' => ['eq', 'gte', 'lte'],
        'email' => ['eq'],
        'address' => ['eq'],
        'paymentMethod' => ['eq'],
    ];
    protected $columnMap = [
        'firstName' => 'first_name',
        'lastName' => 'last_name',
        'phoneNumber' => 'phone_number',
        'paymentMethod' => 'payment_method',
    ];
    protected $operatorMap = [
        'eq' => '=',
        'lt' => '<',
        'lte' => '<=',
        'gt' => '>',
        'gte' => '>=',
    ];
}
