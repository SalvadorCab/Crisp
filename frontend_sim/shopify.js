
const socket=io.connect('https://14aa3574a377.ngrok.io:3000');

const shop = "crisps-dev2";

// Simply brings back all the products in the DB
const refresh = () =>{
    $.ajax({
        url: `/shopify/?shop=${shop}`,
        type: 'GET',
        success: function(res){
            console.log(res);
        }
    });
}

// Creates a new product
const create = () =>{
    $.ajax({
        url: `/shopify/app/create-product?shop=${shop}`,
        type: 'POST',
        success: function(res){
            console.log(res);
        }
    });

    // Here the socket emits to the server a new change in the product by one of the clients
    socket.emit('product_change', {
        message: "new product"
    });

    // Here is the socket listener for any message from the server. 
    // It simply refreshes the page after checking all the items in the DB (including the one that has been added by
    // this or any other client)
    socket.on('product_change', (data) =>{
        refresh();
    })
}

