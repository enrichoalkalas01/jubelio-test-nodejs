# Backend API - Node.js Hapi Project

This is a basic structure for a scalable Node.js backend using Hapi.js. The project follows a modular architecture to ensure clean separation of concerns and easier maintainability as the application grows.

## Table of Contents
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Migrations](#migrations)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)

## Features
- [API Endpoints Products](#Products-API)
- [API Endpoints Users](#Users-API)
- [API Endpoints Imports](#Imports-API)

## Folder Structure
```bash
|-- src
|   |-- configs         # Configuration files for database and environment
|   |-- controllers     # Controllers to handle incoming HTTP requests
|   |-- middlewares     # Middleware functions for token, verification, error handling, etc.
|   |-- migrations      # Database migration files for schema management
|   |-- models          # models representing the database / functions
|   |-- public          # assets for accessed from public
|   |-- routes          # API route definitions
|   |-- repositories    # Business logic and database interaction functions
|   |-- server.ts       # Entry point of the application
|
|-- docker-compose.yml  # file bundling for docker image
|-- Jenkinsfile         # file ci/cd for deployment jenkins
|-- package.json        # NPM dependencies and scripts
|-- Dockerfile          # Docker configuration for containerizing the app
```

## How To Run App
```bash
cd directory
npm run install
npm run dev or start
```

## Products API

