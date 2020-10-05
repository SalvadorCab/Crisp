
const socket=io.connect('https://14aa3574a377.ngrok.io:3000');

const shop = "crisps-dev2";

const create = () =>{
    $.ajax({
        url: `/shopify/app/create-product?shop=${shop}`,
        type: 'POST',
        success: function(res){
            console.log(res);
        }
    });
}