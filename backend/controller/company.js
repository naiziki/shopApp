const Company = require("../models/company");
const connectDB = require('../config/db');
var fs = require('fs');
const fsExtra = require('fs-extra')

const getcompanydetail = async (req, res, next) => {
    connectDB();
    try {
        const company = await Company.find({});
        res.json({ company: company })
    } catch (err) {
        res.status(500).json({ message: "server error" })
    }
}

const addcompanydetail = (req, res, next) => {
    connectDB();

    if (req.body.name) {
        if (req.body.name.length < 5 || req.body.name.length > 20) {
            res.json({ errs: { name: "name must be between 5-15 character" } })
        } else {
            if (req.body.detail) {
                if (req.body.detail.length < 40 || req.body.detail.length > 5000) {
                    return res.json({ errs: { detail: " description must be betwen  400-1000 charcter" } })
                } else {
                    if (req.files) {

                        let dir = "frontend/public/images/company"
                        if (fs.existsSync(dir)) {
                            fsExtra.emptyDirSync(dir)
                        } else {
                            fs.mkdirSync(dir)
                        }
                        let file = req.files.imageUrl;
                        let path = `${dir}/${file.name}`;
                        file.mv(path, async (err) => { 
                            if (err) {
                                res.json({ errs: { image: "failed to upload image" } })
                            } else {
                                Company.deleteMany({}, async (err, doc) => {
                                    if (err) return res.json({ success: { err: "fail to add company detail" } })
                                    else {
                                        await Company.insertMany({
                                            name: req.body.name,
                                            description: req.body.detail,
                                            imageUrl:file.name,
                                        }, (err, docs) => {
                                            if (err) return res.json({ success: { err: "fail to add company detail" } })
                                            else return res.json({ success: { success: "company detail  added successfully" } });
                                        })
                                    }
                                })
                            }
                        })

                    } else { res.json({ errs: { video: "image is required" } }) }
                }
            } else { res.json({ errs: { detail: "detail is required" } }) }
        }
    } else { res.json({ errs: { name: " name is required" } }) }
}

module.exports = {
    getcompanydetail,
    addcompanydetail,
};