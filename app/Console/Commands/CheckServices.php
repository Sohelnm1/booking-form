<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Service;

class CheckServices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:services';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check what services are in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking services in database...');
        
        $totalServices = Service::count();
        $activeServices = Service::where('is_active', true)->count();
        
        $this->info("Total services: {$totalServices}");
        $this->info("Active services: {$activeServices}");
        
        $this->info("\nAll services:");
        $services = Service::all(['id', 'name', 'is_active', 'is_upcoming']);
        
        foreach ($services as $service) {
            $status = $service->is_active ? 'Active' : 'Inactive';
            $upcoming = $service->is_upcoming ? ' (Upcoming)' : '';
            $this->line("ID: {$service->id}, Name: {$service->name}, Status: {$status}{$upcoming}");
        }
        
        $this->info("\nServices that would be shown on dashboard:");
        $dashboardServices = Service::where('is_active', true)->ordered()->get(['id', 'name', 'is_active', 'is_upcoming']);
        
        foreach ($dashboardServices as $service) {
            $upcoming = $service->is_upcoming ? ' (Upcoming)' : '';
            $this->line("ID: {$service->id}, Name: {$service->name}{$upcoming}");
        }
        
        return 0;
    }
}
