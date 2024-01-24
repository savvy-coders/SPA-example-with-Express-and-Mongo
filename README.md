# SPA Example

### Complete Savvy Coders SPA Example with Single Page Application and Express REST API Server

## Setup

Run `npm run install` to install necessary package

## .env File

Create/update the .env file at the root level with the following key/values, update as needed:

```bash
PIZZA_PLACE_API_URL=http://localhost:4040  
MONGODB=mongodb://localhost/pizza 
[^---This MONGODB value above should be changed to be your own mongodb cluster connection string! See the curriculum for more on that!---^]
OPEN_WEATHER_MAP_API_KEY=
```

## Execution

You must start both the SPA and Server using the `npm run serve` and `npm run app:watch` commands in separate terminals.

___

## NPM Script Commands

In the terminal use npm run

`serve`: Start the frontend SPA with hot reload  
`app:watch`: Start the backend API with hot reload  
`parcel-build`: Package SPA for production deployment
