const dotenv=require('dotenv').config();
const express=require('express');
const crypto=require('crypto');
const cookie=require('cookie');
const nonce=require('nonce');
const querystring=require('querystring');
const request=require('request-promise');

const apiKey=process.env.SHOPIFY_API_KEY;
const apiSecret=process.env.SHOPIFY_API_SECRET;
const scopes='write_products';
const forwardingAddress='ngrok_address';

const app=express();

app.post('/', (req, res) =>{
    res.send("Hello");
});

app.listen(3000, ()=>{
    console.log("Successfully connected!!!");
})