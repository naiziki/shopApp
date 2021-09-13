const Employer = require("../models/employer");
const connectDB = require('../config/db');
var fs = require('fs');

const getemployer = async (req, res, next) => {
    connectDB();
    try {
        const employer = await  Employer.find({});
        res.json({ employer : employer})
    } catch (err) {
        res.status(500).json({success:{err: "server error" }})
    }
}
const addemployer = async (req, res, next) => {
    connectDB();

    connectDB();
    if (req.body.name) {
        Employer.findOne({ name: req.body.name }, async (err, docs) => {
            if (docs) {
                res.json({ errs: { name: "employer already exist" } })
            }
            else {
                if (req.body.detail) {
                    if (req.body.detail.length > 150) {
                        if (req.files) {
                            let dir = "frontend/public/images/employer"
                            if (!fs.existsSync(dir)) fs.mkdirSync(dir)
                            let file = req.files.file;
                            let path = `${dir}/${file.name}`;
                            file.mv(path, async (err) => {
                                if (err) {
                                    res.json({ errs: { image: "failed to upload image" } })
                                }
                                else {
                                    try {
                                        await Employer.insertMany({
                                            name: req.body.name,
                                            description: req.body.detail,
                                            imageUrl: file.name,
                                        });
                                        res.json({ success: { success: "new employer added" } })
                                    }
                                    catch (err) {
                                        res.json({ success: { err: " faild  to add a new employer" } })
                                    }
                                }
                            })
                        } else {
                            res.json({ errs: { image: "image is required" } })
                        }
                    } else {
                        res.json({ errs: { detail: " details must have more then 150 charcter" } })
                    }

                } else {
                    res.json({ errs: { detail: "detail are required" } })
                }
            }
        })
    } else {
        res.json({ errs: { name: "name is required" } })
    }
}
const delemployer = async (req, res, next) => {
    connectDB();
    Employer.findByIdAndDelete(req.params.id)
        .then(delet => {
            fs.unlinkSync(`frontend/public/images/employer/${delet.imageUrl}`)
        })
        .then(() => res.json({ success: { success: "product deleted" } }))
        .catch(err => res.json({ errs: { err: "delet product faild" } }))
}

module.exports = {
    getemployer,
    addemployer,
    delemployer,
};