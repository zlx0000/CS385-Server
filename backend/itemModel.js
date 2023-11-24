const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: '45.77.38.37',
    database:'CS385',
    password:'',
    port: 7625,
});
const getItems = async () => {
    try {
      return await new Promise(function (resolve, reject) {
        pool.query("SELECT * FROM items", (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(results.rows);
          } else {
            reject(new Error("No results found"));
          }
        });
      });
    } catch (error_1) {
      console.error(error_1);
      throw new Error("Internal server error");
    }
  };
  //create a new item record in the databsse
  const createItem = (body) => {
    return new Promise(function (resolve, reject) {
      const { item_id,item_name,item_type,item_price,owner_id } = body;
      pool.query(
        "INSERT INTO items (item_id,item_name,item_type,item_price,owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [item_id,item_name,item_type,item_price,owner_id],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(
              `A new item has been added: ${JSON.stringify(results.rows[0])}`
            );
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  };
  //delete a item
  const deleteItem = (item_id) => {
    return new Promise(function (resolve, reject) {
      pool.query(
        "DELETE FROM items WHERE item_id = $1",
        [item_id],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(`Item deleted with ID: ${item_id}`);
        }
      );
    });
  };
  //update a item record
  const updateItem = (item_id, body) => {
    return new Promise(function (resolve, reject) {
      const { item_name,item_type,item_price,owner_id } = body;
      pool.query(
        "UPDATE items SET item_name = $1, item_type = $2, item_price = $3, owner_id = $4, WHERE id = $5 RETURNING *",
        [item_name,item_type,item_price,owner_id,item_id,],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(`Item updated: ${JSON.stringify(results.rows[0])}`);
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  };
  module.exports = {
    getItems,
    createItem,
    deleteItem,
    updateItem
  };