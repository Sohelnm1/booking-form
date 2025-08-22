<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\FormField;

class CheckFormFields extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:form-fields';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check form fields and their configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking form fields...');
        
        $fields = FormField::all(['id', 'name', 'label', 'type', 'is_primary', 'rendering_control']);
        
        $this->table(
            ['ID', 'Name', 'Label', 'Type', 'Primary', 'Rendering Control'],
            $fields->map(function($field) {
                return [
                    $field->id,
                    $field->name,
                    $field->label,
                    $field->type,
                    $field->is_primary ? 'Yes' : 'No',
                    $field->rendering_control ?? 'None'
                ];
            })
        );
        
        $this->info('Location fields:');
        $locationFields = FormField::where('type', 'location')->get();
        foreach($locationFields as $field) {
            $this->line("ID: {$field->id}, Name: {$field->name}, Label: {$field->label}");
        }
    }
}
