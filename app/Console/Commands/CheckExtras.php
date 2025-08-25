<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Extra;

class CheckExtras extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:extras';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check what extras are in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking extras in database...');
        
        $totalExtras = Extra::count();
        $activeExtras = Extra::where('is_active', true)->count();
        
        $this->info("Total extras: {$totalExtras}");
        $this->info("Active extras: {$activeExtras}");
        
        $this->info("\nAll extras:");
        $extras = Extra::all(['id', 'name', 'description', 'price', 'is_active', 'sort_order']);
        
        foreach ($extras as $extra) {
            $status = $extra->is_active ? 'Active' : 'Inactive';
            $this->line("ID: {$extra->id}, Name: {$extra->name}, Price: ₹{$extra->price}, Status: {$status}");
        }
        
        $this->info("\nActive extras that would be shown on dashboard:");
        $dashboardExtras = Extra::where('is_active', true)->ordered()->get(['id', 'name', 'description', 'price', 'sort_order']);
        
        foreach ($dashboardExtras as $extra) {
            $this->line("ID: {$extra->id}, Name: {$extra->name}, Price: ₹{$extra->price}");
        }
        
        return 0;
    }
}
