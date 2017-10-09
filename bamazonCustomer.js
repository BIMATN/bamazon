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
	bamazonRun();
	//connection.end();
});

function bamazonRun(){
	inquirer.prompt([
		{
			type: 'password',
			name: 'administrator',
			message: 'Administrator? Enter Password:'
		}
	]).then(function(choice){
		if(choice.administrator === 'bamazon'){
			//code for administrator functions
			console.log('you are in the admin section');
		}
		else{
			showInventory();
		};
	}).then(function(choice){
		inquirer.prompt([
			{
				type: "list",
			    name: "itemSelection",
			    message: "Please Select An Item to Purchase",
			    choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
			},
			{
				type: "input",
			    name: "quantity",
			    message: "How many would you like? [Enter a number]"
			}
		]).then(function(choice){
			if (typeof(parseInt(choice.quantity)) === 'number' && parseInt(choice.quantity)>0){
				let custChoice = parseInt(choice.itemSelection[0]);
				let custQty = parseInt(choice.quantity);
				// console.log('You have made this choice: '+custChoice);
				// console.log('You have chose this many items: '+custQty);
				inventoryCheck(custChoice, custQty);
			}
			else console.log('You have not entered a quantifiable value for how many items you want. Please begin again. Thank you!');
			connection.end();
		});
	});
}

function showInventory() {
	var query = connection.query("SELECT * FROM products", function(err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log('---------------------------------------------------------------------------------');
			console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price+ ' Credits');
			console.log('---------------------------------------------------------------------------------');
		};
	});
}

function inventoryCheck(customerChoice, customerQuantity){
	var query = connection.query("SELECT stock_quantity, price FROM products WHERE item_id=?",[customerChoice], function(err, res) {
		/*console.log(choice.itemSelection[0]);
		console.log(res[0].stock_quantity);
		console.log(res[0].price);*/
		if(err) throw err;
		let presentStock = res[0].stock_quantity;
		let price = res[0].price;
		if(presentStock>customerQuantity){
			presentStock-=customerQuantity;
			updateQuantity(customerChoice, customerQuantity, presentStock, price);
		}
		else{
			console.log('There is not enough inventory to perform your purchase, please try again later. Thank you for your patronage.')
			connection.end();
		}
	});	
}

function updateQuantity(customerChoice, customerQuantity, presentStock, price) {
  console.log("Calculating Purchase...\n");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
	    {
	    	stock_quantity: presentStock
	    },
	    {
	    	item_id: customerChoice
	    }
    ],
    function(err, res) {
    	if(err) throw (err);
    	let total = customerQuantity*price;
      	console.log('Your total purchase cost: ' + total + ' Units');
      	console.log('Thank you for your purchase!');
      	connection.end();
    }
  );
}