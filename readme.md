# Backend API - Node.js Hapi Project

This is a basic structure for a scalable Node.js backend using Hapi.js. The project follows a modular architecture to ensure clean separation of concerns and easier maintainability as the application grows.

## Table of Contents
- [Features](#features)
- [Folder Structure](#folder-structure)
- [How To Run App](#How-To-Run-App)
- [Environment Variables](#Environtment-Variables)
- [API Routes](#api-routes)

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
cd directory                # go to the app folder
npm run install             # install depedency
npm run migrate -- --all    # migrate all table schema
npm run dev or start        # running the app
```

## Environtment Variables
```bash
SECRET_KEY         # secret-key-here-123! 
PORT               # 5700
BASE_URL_DB        # postgres://postgres:postgres@localhost:5432/jubelio-test
```

## Products API
- Create API
- Read API
- Read Detail API
- Update API
- Delete API
