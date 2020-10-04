const dotenv=require('dotenv').config();
const express=require('express');
const crypto=require('crypto');
const cookie=require('cookie');
const nonce=require('nonce')();
const querystring=require('querystring');
const request=require('request-promise');

const apiKey=process.env.SHOPIFY_API_KEY;
const apiSecret=process.env.SHOPIFY_API_SECRET;
const scopes='write_products';
const forwardingAddress='https://07b6d43dd2db.ngrok.io';
const shopifyUrlEnd='.myshopify.com';

const app=express();

app.get('/', (req, res) =>{
    res.send("Hello");
});

app.get('/shopify', (req, res) =>{
    const shop=req.query.shop;
    if(shop){
        const state=nonce();
        console.log(state);
        const redirectUri=`${forwardingAddress}/shopify/callback`;
        const installUrl=`https://${shop}${shopifyUrlEnd}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`;
         
        res.cookie('state', state);
        res.redirect(installUrl);
    } else {
        return res.status(400).send("Missing shop parameter.")
    }
});

// endpoint to route the app to the store (crisp-dev1 or crisp-dev2) The store is set by the client
app.get('/shopify/callback', (req, res) =>{
    const { shop, hmac, code, state }=req.query;
    const stateCookie=cookie.parse(req.headers.cookie).state;

    if(state !== stateCookie){
        return res.status(403).send("Request origin cannot be verified");
    }

    if(shop && hmac && cookie){
        const map = Object.assign({},req.query);
        delete map['hmac'];
        const message = querystring.stringify(map);
        const generatedHash = crypto
            .createHmac('sha256', apiSecret)
            .update(message)
            .digest('hex');

        if(generatedHash !== hmac){
            return res.status(400).send('HMAC validation failed!');
        }

        res.status(200).send('HMAC validated');
    } else {
        res.status(400).send('Required parameters missing');
    }
});

app.listen(3000, ()=>{
    console.log("Successfully connected!!!");
})