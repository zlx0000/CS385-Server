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
        pool.query("SELECT * FROM itemdata", (error, results) => {
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
      const { itemname,itemtype,itemprice,ownerid,ownerfirstname,ownerlastname,phonenumber,address,itemcondition } = body;
      pool.query(
        "INSERT INTO itemdata (itemname,category,price,ownerid,ownerfirstname,ownerlastname,phonenumber,address,itemcondition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [itemname,itemtype,itemprice,ownerid,ownerfirstname,ownerlastname,phonenumber,address,itemcondition],
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
        "DELETE FROM itemdata WHERE itemid = $1",
        [item_id],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(`Item deleted with ID: ${itemid}`);
        }
      );
    });
  };
  //update a item record
  const updateItem = (itemid, body) => {
    return new Promise(function (resolve, reject) {
      const { category, itemname, itemcondition, price, ownerid, ownerfirstname, ownerlastname, phonenumber, address } = body;
      pool.query(
        "UPDATE itemdata SET category = $1, itemname = $2, itemcondition = $3, price = $4, ownerid = $5, WHERE itemid = $9 RETURNING *",
        [category, itemname, itemcondition, price, ownerid, ownerfirstname, ownerlastname, itemid],
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
