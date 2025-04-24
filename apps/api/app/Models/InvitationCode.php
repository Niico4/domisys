<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvitationCode extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'role',
        'used',
    ];

    public static function generateCode(string $role): string
    {
        $code = strtoupper(substr(md5(uniqid()), 0, 8));

        self::create([
            'code' => $code,
            'role' => $role,
        ]);

        return $code;
    }

    public static function validateCode(string $code, string $role): bool
    {
        return self::where('code', $code)
            ->where('role', $role)
            ->where('used', false)
            ->exists();
    }

    public static function markAsUsed(string $code): void
    {
        self::where('code', $code)->update(['used' => true]);
    }
}
