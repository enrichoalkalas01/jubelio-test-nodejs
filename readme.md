# Backend API - Node.js Hapi Project

This project is a Node.js backend built with Hapi.js, following a modular architecture for scalability, maintainability, and clean separation of concerns. The project is containerized with Docker and integrated with Jenkins for CI/CD deployment.

## Table of Contents
- [Features](#features)
- [Folder Structure](#folder-structure)
- [How To Run App](#how-to-run-app)
- [Environment Variables](#environment-variables)
- [Products API](#products-api)
- [Users API](#users-api)

## Features
- Scalable architecture for building larger applications
- Clean folder structure with separation of concerns (Controllers, Services, Routes, Repositories)
- API Endpoints for managing users, products, and imports
- Integrated Docker setup for easy containerization and local development
- CI/CD pipeline with Jenkins for automated testing and deployment

## Folder Structure
```bash
|-- src
|   |-- configs         # Configuration files for database, environment, etc.
|   |-- controllers     # Controllers to handle incoming HTTP requests
|   |-- middlewares     # Middleware functions for token validation, error handling, etc.
|   |-- migrations      # Database migration files for schema management
|   |-- models          # Models representing the database schema
|   |-- public          # Public assets for client access
|   |-- routes          # API route definitions
|   |-- repositories    # Business logic and database interactions
|   |-- services        # Service layer to abstract business logic
|   |-- server.ts       # Entry point of the application
|
|-- docker-compose.yml  # Configuration for Docker containers
|-- Jenkinsfile         # Jenkins pipeline configuration for CI/CD
|-- package.json        # NPM dependencies and scripts
|-- Dockerfile          # Docker configuration for containerizing the app
```

## How To Run App
```bash
git clone <repository-url>  # clone app into local folder
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
```bash
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "<bearer-token-here>");

    const formdata = new FormData();
    formdata.append("image", fileInput.files[0], "/C:/Users/<users>/Downloads/modern-gold-background-free-vector.jpg"); ## image file format
    formdata.append("title", "product");
    formdata.append("slug", ""); ## can be optional cause if null the slug will be generated from title
    formdata.append("description", "loremp ipsum sit dolor amet"); ## optional
    formdata.append("price", "10000");
    formdata.append("sku", ""); ## can be optional cause if null the sku will be generated

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
    };

    fetch("http://localhost:<port>/api/v1/products", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
```
- Read API
```bash
    const myHeaders = new Headers(); ## optional
    myHeaders.append("Authorization", "<bearer-token-here>"); ## optional

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://localhost:<port>/api/v1/products?query=product&size=2&page=1&sorted_by=id&order_by=desc&usage=private", requestOptions) ## usage for public = "" & private = "private"
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
```

- Read Detail API
```bash
    const myHeaders = new Headers(); ## optional
    myHeaders.append("Authorization", "<bearer-token-here>"); ## optional

    const requestOptions = {
        method: "GET",
        headers: myHeaders, ## optional
        redirect: "follow"
    };

    fetch("localhost:<port>/api/v1/products/1", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
```

- Update API
```bash
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "<bearer-token-here>");

    const formdata = new FormData();
    formdata.append("image", fileInput.files[0], "/C:/Users/<users>/Downloads/modern-gold-background-free-vector.jpg"); ## image file format
    formdata.append("title", "product");
    formdata.append("slug", ""); ## can be optional cause if null the slug will be generated from title
    formdata.append("description", "loremp ipsum sit dolor amet"); ## optional
    formdata.append("price", "10000");
    formdata.append("sku", ""); ## can be optional cause if null the sku will be generated

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
    };

    fetch("http://localhost:<port>/api/v1/products", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
```

- Delete API
```bash
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "<bearer-token-here>");

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("localhost:<port>/api/v1/products/<id>", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
```

## Users API
- Create API
```bash
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "<bearer-token-here>");

    const raw = JSON.stringify({
        "username": "admin",
        "firstname": "admin",
        "lastname": "admin",
        "phonenumber": "081282959210",
        "password": "admin",
        "email": "admin@example.com",
        "type": "user" or "admin"
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("localhost:<port>/api/v1/users", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
```

- Read API
```bash
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "<bearer-token-here>");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("localhost:<port>/api/v1/users", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
```

- Read Detail API
```bash
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "<bearer-token-here>");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("localhost:<port>/api/v1/users/<id>", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
```

- Update API
```bash
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "<bearer-token-here>");

    const raw = JSON.stringify({
        "username": "admin",
        "firstname": "admin",
        "lastname": "admin",
        "phonenumber": "081282959210",
        "password": "admin",
        "email": "admin@example.com",
        "type": "user" or "admin"
    });

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("localhost:5700/api/v1/users/<id>", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
```

- Delete API
```bash
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "<bearer-token-here>");

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("localhost:<port>/api/v1/users/<id>", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
```