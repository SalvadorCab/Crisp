const dotenv=require('dotenv').config();
const express=require('express');
const crypto=require('crypto');
const cookie=require('cookie');
const nonce=require('nonce')();
const querystring=require('querystring');
const request=require('request-promise');
const socket=require('socket.io');

const apiKey=process.env.SHOPIFY_API_KEY;
const apiSecret=process.env.SHOPIFY_API_SECRET;
const scopes='write_products';
const forwardingAddress='https://14aa3574a377.ngrok.io';
const shopifyUrlEnd='.myshopify.com';

const app=express();

app.get('/', (req, res) =>{
    res.send("Hello");
});

app.get('/shopify', (req, res) =>{
    const shop=req.query.shop;
    if(shop){
        const state=nonce();
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

        const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code
        };

        request.post(accessTokenRequestUrl, { json: accessTokenPayload })
        .then((accessTokenResponse) => {
            const accessToken = accessTokenResponse.access_token;
            //const apiRequestUrl = `https://${shop}/admin/shop.json`;
            const apiRequestUrl = `https://${shop}/admin/products.json`;
            const apiRequestHeader = {
                'X-Shopify-Access-Token': accessToken
            }

            request.get(apiRequestUrl, { headers: apiRequestHeader })
            .then(apiResponse => {
                res.send(JSON.parse(apiResponse));
            })
            .catch(error => {
                res.status(418).send(error.error.message);
            })
        })
        .catch(error => {
            console.log(error);
            res.status(418).send(error.error.message);
            });
    } else { 
        res.status(400).send('Required parameters missing');
    }
});

app.post('/app/create-product', (req, res) =>{
    console.log(`create product for ${shop}`);
    /*
    let new_product = {
        product: {
            title: req.body.title,
            body_html: req.body.body_html,
            vendor: req.body.vendor,
            product_type: req.body.product_type,
            tags: req.body.tags
        }
    };
    */
  
    let new_product = {
        "product": {
            "title": "Short sleeved shirt",
            "body_html": "<strong>Elegant Shirt</strong>",
            "sku": "SDF-345gh-234",
            "vendor": "Crisps",
            "product_type": "Short sleeved shirt",
            "tags": "Crisps"
            }
        }
    
    let url = 'https://' + req.query.shop + '.myshopify.com/admin/products.json';

    let options = {
        method: 'POST',
        uri: url,
        json: true,
        resolveWithFullResponse: true,//added this to view status code
        headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY,
            'content-type': 'application/json'
        },
        body: new_product  
    }

    request.post(options)
        .then(function (response) {
            console.log(response.body);
            if (response.statusCode == 201) {
                res.json(true);
            } else {
                res.json(false);
            }

        })
        .catch(function (err) {
            console.log(err);
            res.json(false);
        });
});

const server = app.listen(3000, ()=>{
    console.log("Successfully connected!!!");
})

// Socket waiting for changes in the server
const io=socket(server);

// Triggering the listener and connecting to the server
io.on('connection', socket=>{
    console.log("Connection socket triggered");
});