const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('./models/product');
const Farm = require('./models/farm');
const app = express();
const PORT = 3000;

const categories = ['fruit', 'vegetable', 'dairy', 'fungi'];

mongoose
	.connect('mongodb://localhost:27017/farmStandTake2', {
		useNewUrlParser: true,
	})
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

// *** FARM ROUTES ***
app.get('/farms', async (req, res) => {
	const farms = await Farm.find({});
	res.render('farms/index', { farms });
});

app.get('/farms/new', (req, res) => {
	res.render('farms/new');
});

app.get('/farms/:id', async (req, res) => {
	const { id } = req.params;
	const farm = await Farm.findById(id);
	res.render('farms/show', { farm });
});

app.get('/farms/:id/products/new', (req, res) => {
	const { id } = req.params;
	res.render('products/new', { id, categories });
});

app.post('/farms/:id/products', async (req, res) => {
	const { id } = req.params;
	const farm = await Farm.findById(id);
	const { name, price, category } = req.body;
	const product = new Product({ name, price, category });
	farm.products.push(product);
	product.farm = farm;
	await farm.save();
	await product.save();
	res.send(farm);
});

app.post('/farms', async (req, res) => {
	const farm = new Farm(req.body);
	await farm.save();
	res.redirect('farms');
});

// *** PRODUCT ROUTES ***
app.get('/products', async (req, res) => {
	const { category } = req.query;
	if (category) {
		const products = await Product.find({ category });
		const capitalizedCategory =
			category.charAt(0).toUpperCase() + category.slice(1);

		res.render('products/index', {
			products,
			category,
			capitalizedCategory,
		});
	} else {
		const products = await Product.find({});
		res.render('products/index', {
			products,
			capitalizedCategory: 'All',
			category,
		});
	}
});

app.get('/products/new', (req, res) => {
	res.render('products/new', { categories });
});

app.get('/products/:id', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	res.render('products/show', { product });
});

app.get('/products/:id/edit', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	res.render('products/edit', { product, categories });
});

app.post('/products', async (req, res) => {
	const newProduct = new Product(req.body);
	await newProduct.save();
	console.log(newProduct);
	res.redirect(`/products/${newProduct._id}`);
});

app.put('/products/:id', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findByIdAndUpdate(id, req.body, {
		runValidators: true,
	});
	res.redirect(`/products/${product._id}`);
	console.log(req.body);
});

app.delete('/products/:id', async (req, res) => {
	const { id } = req.params;
	const productToDelete = await Product.findByIdAndDelete(id);
	res.redirect('/products');
});

app.listen(PORT, () => {
	console.log(`App is listening on port ${PORT}...`);
});
