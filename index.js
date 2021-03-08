const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
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

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
	const products = await Product.find({});
	res.render('products/index', { products });
});

app.get('/products/new', (req, res) => {
	res.render('products/new');
});

app.get('/products/:id', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	res.render('products/show', { product });
});

app.get('/products/:id/edit', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	res.render('products/edit', { product });
});

app.put('/products/:id', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findByIdAndUpdate(id, req.body, {
		runValidators: true,
	});
	res.redirect(`/products/${product._id}`);
	console.log(req.body);
});

app.post('/products', async (req, res) => {
	const newProduct = new Product(req.body);
	await newProduct.save();
	console.log(newProduct);
	res.redirect(`/products/${newProduct._id}`);
});

app.listen(PORT, () => {
	console.log(`App is listening on port ${PORT}...`);
});
