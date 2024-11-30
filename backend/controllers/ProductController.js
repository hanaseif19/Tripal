const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../cloudinary");

const Product = require("../models/Product.js");
const Seller = require("../models/users/Seller.js");

const createProduct = asyncHandler(async (req, res) => {
  const { name, sellerID, price, description, quantity, picture } = req.body;

  const seller = await Seller.findById(sellerID);
  if (!seller) {
    res.status(404);
    throw new Error("Seller not found");
  }
  let result;
  try {
    result = await cloudinary.uploader.upload(picture, {
      folder: "products",
    });
  } catch (error) {
    console.log(error.message);
  }

  const product = await Product.create({
    name,
    seller,
    price,
    description,
    quantity,
    picture: result.secure_url,
  });
  await product.save();
  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const productsPerPage = 8;
  const {
    searchValue = "",
    minPrice,
    maxPrice,
    sortOrder,
    userRole,
  } = req.query;

  const filter = {};
  if (searchValue) {
    filter.name = { $regex: new RegExp(searchValue, "i") };
  }

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) {
      if (parseFloat(maxPrice) !== 3000) {
        filter.price.$lte = parseFloat(maxPrice);
      }
    }
  }

  const sort = {
    averageRating: sortOrder === "asc" ? 1 : -1,
    _id: 1,
  };

  const skip = (page - 1) * productsPerPage;

  try {
    const baseFilter =
      userRole === "Tourist" ? { ...filter, isArchived: false } : filter;
    const totalProducts =
      page === 1 ? await Product.countDocuments(baseFilter) : null;

    const products = await Product.find(baseFilter)
      .populate("seller")
      .skip(skip)
      .limit(productsPerPage)
      .sort(sort);

    res.status(200).json({
      products,
      totalPages: totalProducts
        ? Math.ceil(totalProducts / productsPerPage)
        : undefined,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

const searchProductsByName = asyncHandler(async (req, res) => {
  const { name } = req.query;
  if (!name) {
    res.status(400);
    throw new Error("name is required");
  }

  const products = await Product.find({
    name: { $regex: new RegExp(`${name}`, "i") },
  });

  res.status(200).json(products);
});

const filterProductsByPrice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  if (!minPrice && !maxPrice) {
    res.status(400);
    throw new Error("At least one value should be provided");
  }

  const query = {};

  if (minPrice) {
    query.price = { ...query.price, $gte: minPrice };
  }

  if (maxPrice) {
    query.price = { ...query.price, $lte: maxPrice };
  }

  const products = await Product.find(query);
  res.status(200).json(products);
});

const sortProductsByRatings = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ averageRating: -1 });
  res.json(products);
});

const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, description, quantity, picture, initialPicture } =
    req.body;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (
    !name &&
    !price &&
    !description &&
    !quantity &&
    !picture &&
    !initialPicture
  ) {
    res.status(400);
    throw new Error("At least one value should be provided");
  }
  let updatedProduct;
  if (picture) {
    let result;
    try {
      const oldPicturePublicId = product.picture
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      // Delete old picture
      await cloudinary.uploader.destroy(oldPicturePublicId);

      // Upload new picture
      result = await cloudinary.uploader.upload(picture, {
        folder: "products",
      });

      updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, price, description, quantity, picture: result.secure_url },
        { new: true }
      );
    } catch (error) {
      console.log(error.message);
    }
  } else {
    updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, quantity },
      { new: true }
    );
  }

  res.status(200).json(updatedProduct);
});

const archiveProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    product.isArchived = true;
    await product.save();

    res.status(200).json({ message: "Product archived successfully", product });
  } catch (error) {
    console.log(error.message);
  }
});

const unArchiveProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    product.isArchived = false;
    await product.save();

    res
      .status(200)
      .json({ message: "Product unarchived successfully", product });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = {
  createProduct,
  getProducts,
  searchProductsByName,
  filterProductsByPrice,
  sortProductsByRatings,
  editProduct,
  archiveProduct,
  unArchiveProduct,
};
