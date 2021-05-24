# SPA Example with Express and Mongo database

## Setup

Run `npm run install` to install necessary package

### .env File

Create/update the .env file with the following key/values, update as needed:

API_URL="http://localhost:4040"  
DB_CONNECT="mongodb://localhost/pizza"  
DB_PORT=4040  

## Execution

You must start both the SPA and Server using the `spa:watch` and `server:watch` in separate terminals.

### NPM Script Commands:  
`serve`: Start the frontend SPA with hot reload  
`spa:watch`: Start the frontend SPA with hot reload  
`server:watch`: Start the backend API with hot reload  
`parcel-build`: Package SPA for production deployment


