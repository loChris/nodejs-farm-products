const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');

const app = express();
const PORT = 3000;

mongoose
	.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true })
	.then(() => {
		console.log('connection open...');
	})
	.catch((err) => {
		console.log(err);
	});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/products', async (req, res) => {
	const products = await Product.find({});
	res.render('products/index', { products });
});

app.listen(PORT, () => {
	console.log(`App is listening on port ${PORT}...`);
});
