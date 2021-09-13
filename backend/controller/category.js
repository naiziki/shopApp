const Category = require("../models/category");
const Product = require("../models/Product");
const connectDB = require('../config/db');
var fs = require('fs');

const addAllCategory = async (req, res, next) => {
    connectDB();
    if (req.body.category) {
        var slage = req.body.category.replace(/\s/g, "-").toLowerCase();
        Category.findOne({ slage: slage }, async (err, docs) => {
            if (docs) {
                res.json({ errs: { category: "category already exist" } })
            }
            else {
                if (req.files) {
                    let dir = `frontend/public/images/${req.body.category}`
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
                    let file = req.files.file;
                    let path = `${dir}/${file.name}`;
                    file.mv(path, async (err) => {
                        if (err) {
                            res.json({ errs: { image: "failed to upload image" } })
                        }
                        else {
                            try {
                                await Category.insertMany({
                                    category: req.body.category,
                                    image: req.body.image,
                                    slage: slage,
                                });
                                res.json({ success: { category: "new category added", image: "successful image upload" } })
                            }
                            catch (err) {
                                res.json({ errs: { category: "add a new category faild " } })
                            }
                        }
                    })
                } else {
                    res.json({ errs: { image: "image is required" } })
                }
            }
        })
    } else {
        res.json({ errs: { category: "categoy is required" } })
    }
}

const updateCategory = async (req, res, next) => {
    connectDB();
    var del_path = '';
    if (req.body.category) {
        Category.findById(req.params.id)
            .then(cat => {
                del_path = `frontend/public/images/${req.body.category}/${cat.image}`
                Category.findOne({ category: req.body.category, _id: { $ne: req.params.id } })
                    .then((docs) => {

                        if (docs) { res.json({ errs: { category: "category already exist" } }) }
                        else {
                            if (req.files) {
                                let file = req.files.image;
                                let path = `frontend/public/images/${req.body.category}/${file.name}`;
                                file.mv(path, (err) => {

                                    if (err) { res.json({ errs: { image: "failed to upload image" } }) }
                                    else {
                                        try {
                                            cat.category = req.body.category
                                            cat.image = req.files.image.name
                                            cat.slage = req.body.category.replace(/\s/g, "-").toLowerCase()
                                            cat.save()
                                                .then(() =>
                                                    fs.unlink(del_path, err => {
                                                        if (err) res.json({ errs: { category: " update category faild " } })
                                                        else res.json({ success: { category: "category updated ", image: "successful image upload" } })
                                                    }))
                                        } catch (err) { res.json({ errs: { category: " update category faild " } }) }
                                    }
                                })
                            } else { res.json({ errs: { image: "image is required" } }) }
                        }
                    })
            })
            .catch(() =>
                res.json({ errs: { category: " this category doesn't exist " } }))
    } else {
        res.json({ errs: { category: "category is required" } })
    }
}

const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.json(category)
    } catch (err) {
        res.status(500).json({ message: "server error" })
    }
}

const getAllategory = async (req, res, next) => {
    connectDB();
    try {
        const categorys = await Category.find({});
        res.json(categorys)
    } catch (err) {
        res.status(500).json({ message: "server error" })
    }
}

const deletCategory = async (req, res, next) => {
    connectDB();
    Product.deleteMany({ category: req.params.category })
        .then(() => Category.deleteOne({ category: req.params.category }))
        .then(() =>
            res.json({ success: "category has been deleted" }),
            fs.rmdirSync(`frontend/public/images/${req.params.category}`, { recursive: true })
        )
        .catch(err => res.status(400).json("Error: " + err));
}

module.exports = {
    getAllategory,
    addAllCategory,
    deletCategory,
    updateCategory,
    getCategory,
};
