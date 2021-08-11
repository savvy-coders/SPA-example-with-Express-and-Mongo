# SPA Example with Express and Mongo database

## Setup

Run `npm run install` to install necessary package



### Node Packages 

In this repo you will be using: 

`axios` : Is a popular, promise-based HTTP client that sports an easy-to-use API and can be used in both the browser and Node. ... Making HTTP requests to fetch or save data is one of the most common tasks a client-side JavaScript application will need to do.

<br>

`body-parser` : Is the Node. js body parsing middleware. It is responsible for parsing the incoming request bodies in a middleware before you handle it.

<br>

`dotenv` : Is a zero-dependency module that loads environment variables from a .env file into process.env . Storing configuration in the environment separate from your code

<br>

`express` : The Express philosophy is to provide small, robust tooling for HTTP servers, making it a great solution for single page applications, web sites, hybrids, or public HTTP APIs.

<br>

`html-literal` : Useful for writing HTML as simple template tag literals that provide syntax highlighting (through lit-html extension) and some convenience (no need to manually join arrays, JSON-encode objects etc).

<br>

`lodash` : Is a JavaScript library that provides utility functions for common programming tasks using a functional programming paradigm; it builds upon the older underscore. js library. Lodash has several built-in utility functions that make coding in JavaScript easier and cleaner.

<br>

`mongoose` :is an Object Data Modeling (ODM) library that is used for schema validations and managing relationships among data. Mongoose is frequently used with NodeJS and MongoDB. 

<br>

`navigo` : Is a simple dependency-free minimalistic JavaScript router




### .env File

Create/update the .env file at the root level with the following key/values, update as needed:

`API_URL`="http://localhost:4040"  
`DB_CONNECT`="mongodb://localhost/pizza"  
`DB_PORT`=4040 

Then add this code block to root level index.js for dotenv to work properly

``` 
import dotenv from "dotenv";

dotenv.config();
```


## Execution

You must start both the SPA and Server using the `spa:watch` and `server:watch` in separate terminals.

### NPM Script Commands:  

In the terminal use npm run 
<br>
`serve`: Start the frontend SPA with hot reload  
`spa:watch`: Start the frontend SPA with hot reload  
`server:watch`: Start the backend API with hot reload  
`parcel-build`: Package SPA for production deployment


