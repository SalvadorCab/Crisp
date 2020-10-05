# Solution_Crisps
Solution for Crisps exercise

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Migrate DB](#migrate-db)
* [RollBack DB](#rollback-db)
* [Seed DB](#seed-db)

## General info
This is a Demo that creates the BackEnd routes for a DB used to display products between different stores and
simulates a simple FrontEnd (originally stored at Shopify)
	
## Technologies
Project is created with:
* NodeJS: v12.15.0
* ExpressJS: v4.16.1
* PostgreSQL: v12.4 (on x85_64-pc-linux-musl, compiled by gcc(Alpine 9.3.0) 9.3.0, 64-bit)
* PgAdmin 4: v2.1
* ngrok 2.3.35 (For testing purposes)
	
## Setup
1) To run this project, install it locally using npm:

```
$ cd BackEnd
$ npm install
$ npm start
```

2) At ngrok, run exe and type:

$ngrok html PORT      // PORT is usually 3000

3) At shopify, create app (or use the existing one "crisps-dev-app") and link the right ngrok url obtained from the previous
step.

4) open tab at browser with the next url: 

http://NGROK_URL/shopify?shop=SHOP_NAME   // for example: http://14aa3574a377.ngrok.io/shopify?shop=crisp-dev1

5) Open different tab for the frontend_sim/shopify.html file and click in the button (it simulates the
creation of a new product)


## Migrate DB
To migrate the DB, run this commands:

```
$ cd BackEnd
$ npm db:migrate
```

## RollBack DB
To rollback the DB (eliminate all the tables, except those with KNEX prefix), run this commands:

```
$ cd BackEnd
$ npm db:rollback
```

## Seed DB
To seed the DB with dummy data, run this commands:

```
$ cd BackEnd
$ npm db:seed
```