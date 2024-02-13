<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'is_super_admin'=>true,
        //     'email' => 'superadmin@email.com',
        // ]);

        // \App\Models\User::factory()->create([
        //     'is_super_admin'=>false,
        //     'email' => 'guest@email.com',
        // ]);

        \App\Models\Category::truncate();
        \App\Models\Category::create(['name'=>  'Can Food']);
        \App\Models\Category::create(['name'=>  'Dairy']);
        \App\Models\Category::create(['name'=>  'Snacks']);
        \App\Models\Category::create(['name'=>  'Vegetable']);
        \App\Models\Category::create(['name'=>  'Beverages']);
    }
}
