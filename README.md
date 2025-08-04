# Booking Website

A modern booking platform built with Laravel, React.js, and Inertia.js using Ant Design for the UI.

## Features

-   🚀 Modern Laravel 11 backend
-   ⚛️ React.js frontend with Inertia.js
-   🎨 Professional UI with Ant Design
-   📱 Responsive design
-   🔧 Easy to extend and customize

## Tech Stack

-   **Backend**: Laravel 11
-   **Frontend**: React.js
-   **Bridge**: Inertia.js
-   **UI Library**: Ant Design
-   **Build Tool**: Vite
-   **Database**: SQLite (default)

## Prerequisites

-   PHP 8.2+
-   Composer
-   Node.js 18+
-   npm

## Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd booking_website
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Database setup**

    ```bash
    php artisan migrate
    ```

6. **Build assets**
    ```bash
    npm run build
    ```

## Development

1. **Start the Laravel development server**

    ```bash
    php artisan serve
    ```

2. **Start Vite development server (in another terminal)**

    ```bash
    npm run dev
    ```

3. **Visit the application**
   Open your browser and go to `http://localhost:8000`

## Project Structure

```
booking_website/
├── app/                    # Laravel application logic
├── resources/
│   ├── js/
│   │   ├── Pages/         # React page components
│   │   ├── Layouts/       # Layout components
│   │   └── app.jsx        # Main React app entry
│   └── css/
│       └── app.css        # Custom styles
├── routes/
│   └── web.php           # Web routes
└── bootstrap/
    └── app.php           # Laravel 11 bootstrap config
```

## Available Scripts

-   `npm run dev` - Start Vite development server
-   `npm run build` - Build for production
-   `php artisan serve` - Start Laravel development server
-   `php artisan migrate` - Run database migrations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
