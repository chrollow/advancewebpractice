<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{

    use HasFactory;
    protected $table = 'customers';
    protected $primaryKey = 'id';
    public $timestamps = true; // To use created_at and updated_at fields
    protected $fillable = [
        'user_id',
        'username',
        'address',
        'contact_number',
        'img_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
