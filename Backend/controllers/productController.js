import productModel from '../models/productModel.js';

export const createProduct = async (req, res) => {
    const { name, category, price } = req.body;

    if (!name || !category || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const product = await productModel.create({
        name,
        category,
        price
    })

    res.json({ message: "Product created successfully", product });
}

export const getProducts = async (req, res) => {
    //query

    const category = req.query.category || '';
    console.log(category);
    const query = {};
    if (category) {
        query.category = category;
    }
    const products = await productModel.find(query);
    res.json({ message: "Products found", products });
}

export const getProductById = async (req, res) => {
    const id = req.params.id;
    const product = await productModel.findById(id);
    res.json({ message: "Product found", product });
}

export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, { new: true })
    res.json({ message: "Product updated successfully", updatedProduct });
}

export const deleteproduct = async (req, res) => {
    const id = req.params.id;
    await productModel.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
}

export const getProductsByCategory = async (req, res) => {
    const info = await productModel.aggregate([
        {
            $group: {
                _id: "$category",
                totalProducts: { $sum: 1 },
                averagePrice: { $avg: "$price" },
                totalPrice: { $sum: "$price" },
            },
        },
        {
            $sort: { averagePrice: -1 },
        }
    ])
    res.json({ message: "Products by category", info });
}


//find total number of products in each category

productModel.aggregate([
    {
        $group: {
            _id: "$category",
            totalProducts: { $sum: 1 }
        }
    }
])

//average price

productModel.aggregate([
    {
        $group: {
            _id: "$category",
            averagePrice: { $avg: "$price" }
        }
    }
])

//most expenssive product

productModel.aggregate([
    {
        $sort: { price: -1 }
    },
    {
        $group: {
            _id: "$category",
            mostExpensiveProduct: { $first: "$name" },
            price: { $first: "$price" }
        }
    }
])

//total price for all products in a category

productModel.aggregate([
    {
        $group: {
            _id: "$category",
            totalPrice: { $sum: "$price" },
        },
    },
]);