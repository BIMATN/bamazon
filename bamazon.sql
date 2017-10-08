DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
CREATE TABLE products(
item_id INT(10) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price INT(10) NOT NULL,
stock_quantity INT(10) NOT NULL
);
