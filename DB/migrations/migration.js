require('dotenv').config();

/* MYSQL
const execSQL = require('exec-sql');

execSQL.connect({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

execSQL.executeDirectory('./DB/frodid_app', (err) => {
  if (err) throw err;
  execSQL.disconnect();
  console.log('Done!');
});
*/

exports.up = function(knex, Promise){
  return knex.schema
  .createTable('a001_products', table =>{
    table.increments('id');
    table.varchar('title', 45).notNullable();
    table.varchar('body_html', 45).notNullable();
    table.varchar('sku', 45).notNullable();
    table.varchar('vendor', 45).notNullable();
    table.varchar('product_type', 45).notNullable();
    table.varchar('tags', 45).notNullable();
  })
};

exports.down = function(knex, Promise){
  return knex.schema
          .dropTable('a001_products')
};
