const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	//my username
	user: "root",
	//my password
	password: "zV0zNQ15Mu26",
	database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("Customer Connection: " + connection.threadId);
	showInventory();
	inquirePurchase();
	//connection.end();
});

function inquirePurchase(){
	inquirer.prompt([
		{
			type: "checkbox",
		    name: "itemSelection",
		    message: "Please Select An Item to Purchase",
		    choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
		},
				{
			type: "input",
		    name: "quantity",
		    message: "How many would you like? [Enter a number]",
		}
	]).then(function(choice){
		console.log(choice.itemSelection[0]);
		console.log(choice.quantity);
		inventoryCheck(choice);
		});
}

function showInventory() {
	var query = connection.query("SELECT * FROM products", function(err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log('_________________________________________________________________________________');
			console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price+ ' Credits');
			console.log('_________________________________________________________________________________');
		};
	});
}

function inventoryCheck(choice){
	var query = connection.query("SELECT stock_quantity AND price FROM products WHERE item_id=?",[parseInt(choice.itemSelection[0])], function(err, res) {
		console.log(choice.itemSelection[0]);
		console.log(res[0].stock_quantity);
		console.log(res[0].price);
		if(err) throw err;
		if(res[0].stock_quantity>choice.quantity){
			let newStock = res[0].stock_quantity;
			newStock-=choice.quantity;
			let price = res[0].price;
			updateQuantity(choice, newStock, price);
		}
		else{
			console.log('There is not enough inventory to perform your purchase, please try again later. Thank you for your patronage.')
		}
		/*for (var i = 0; i < res.length; i++) {
		console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price+ ' Credits');
		console.log('_________________________________________________________________________________');}*/
	});	
}

function updateQuantity(choice, stock, price) {
  console.log("Calculating Purchase...\n");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
	    {
	    	stock_quantity: stock
	    },
	    {
	    	item_id: choice.itemSelection[0]
	    }
    ],
    function(err, res) {
    	if(err) throw (err);
    	let total = choice.quantity*price;
      	console.log('Your total purchase cost: ' + total);
      	console.log('Thank you for your purchase!');
    }
  );
}