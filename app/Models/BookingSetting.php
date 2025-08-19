<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class BookingSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
    ];

    /**
     * Get a setting value by key
     */
    public static function getValue($key, $default = null)
    {
        $cacheKey = "booking_setting_{$key}";
        
        return Cache::remember($cacheKey, 3600, function () use ($key, $default) {
            $setting = self::where('key', $key)->first();
            
            if (!$setting) {
                return $default;
            }

            switch ($setting->type) {
                case 'integer':
                    return (int) $setting->value;
                case 'boolean':
                    return (bool) ($setting->value === 'true' || $setting->value === '1' || $setting->value === 1 || $setting->value === true);
                case 'json':
                    return json_decode($setting->value, true);
                default:
                    return $setting->value;
            }
        });
    }

    /**
     * Set a setting value
     */
    public static function setValue($key, $value, $type = 'string', $description = null)
    {
        // Convert value based on type
        $stringValue = '';
        switch ($type) {
            case 'boolean':
                $stringValue = $value ? 'true' : 'false';
                break;
            case 'integer':
                $stringValue = (string) $value;
                break;
            case 'json':
                $stringValue = is_array($value) ? json_encode($value) : $value;
                break;
            default:
                $stringValue = (string) $value;
        }

        $setting = self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $stringValue,
                'type' => $type,
                'description' => $description,
            ]
        );

        // Clear cache
        Cache::forget("booking_setting_{$key}");
        Cache::forget('all_booking_settings');

        return $setting;
    }

    /**
     * Get all settings as an array
     */
    public static function getAllSettings()
    {
        return Cache::remember('all_booking_settings', 3600, function () {
            $settings = self::all();
            $result = [];
            
            foreach ($settings as $setting) {
                $result[$setting->key] = self::getValue($setting->key);
            }
            
            return $result;
        });
    }

    /**
     * Clear all settings cache
     */
    public static function clearCache()
    {
        $settings = self::all();
        foreach ($settings as $setting) {
            Cache::forget("booking_setting_{$setting->key}");
        }
        Cache::forget('all_booking_settings');
    }
}
