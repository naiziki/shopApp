import axios from 'axios';
import React, { Component } from 'react';
import './Addproduct.css'
import Fotter2 from "../components/Fotter2"

class Addproduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            description: '',
            price: '',
            offre: '',
            imageUrl: '',
            countInStock: '',
            categorys: [],
            category: "",
            details: [],
            detail: "",
            detail1: "",
            title: "",
            image: [],
            color: "red",
            color1: "red",

            name_err: "",
            title_err: "",
            price_err: "",
            offre_err: "",
            countInstock_err: "",
            category_err: "",
            description_err: "",
            details_err: "",
            image_err: "",
            success_suc: "",
            success_err: "",

        }
    }

    componentDidMount() { this.setState({ categorys: this.props.category }) };
    onChangecategory = e => this.setState({ category: e.target.value });
    onChangetitle = e => {
        if (e.target.value.length <= 80) {
            this.setState({
                title: e.target.value,
                color1: "red"
            });
        } else if (e.target.value.length <= 200) {
            this.setState({
                title: e.target.value,
                color1: "green"
            });
        }
    }
    onChangedetail = e => {
        if (e.target.value.length <= 15) {
            this.setState({ detail: e.target.value })
        }

    }
    onChangedetail1 = e => {
        if (e.target.value.split(",").every(el=> el.length <=50)) {
            this.setState({ detail1: e.target.value })
        }
    }
    onChangename = e => {
        if (e.target.value.length <= 15) this.setState({ name: e.target.value })
    }

    onChangeprice = e => this.setState({ price: e.target.value });
    onChangeoffre = e => this.setState({ offre: e.target.value });
    onChangeDescription = e => {
        if (e.target.value.length <= 300) {
            this.setState({
                description: e.target.value,
                color: "red"
            })
        } else if (e.target.value.length <= 600) {
            this.setState({
                description: e.target.value,
                color: "green"
            })
        }
    }
    onChangecountInStok = e => this.setState({ countInStock: e.target.value });
    onChangeimage = e => this.setState({ imageUrl: e.target.files });

    handledetails = () => {
        this.setState({
            details: [...this.state.details, { qty: this.state.detail, value: this.state.detail1 }],
            detail: "",
            detail1: ""
        })
    }
    handleitems = (index) => {
        
        this.setState({
            details:this.state.details.filter((x,ind)=> ind !== index)
        })
    }

    onSubmit = e => {
        e.preventDefault();
        const formdata = new FormData();
        var ima = [];
        var data = this.state.imageUrl
        var category = this.state.category === ""
            ? this.state.categorys[0]["category"]
            : this.state.category

        for (var x in data) {
            if (x !== "length" && x !== "item" && Number(x) < 5) {
                formdata.append(`file${x}`, data[x])
                ima.push(data[x]["name"])
            }
        }

        const product = {
            name: this.state.name,
            description: this.state.description,
            price: this.state.price,
            offre: this.state.offre,
            countInStock: this.state.countInStock,
            category: category,
            title: this.state.title,
            details: JSON.stringify(this.state.details),
            imageUrl: JSON.stringify(ima)
        }

        for (var y in product) { formdata.append(y, product[y]) }
        try {
            axios
                .post("/api/addproducts", formdata)
                .then(res => {
                    const { errs, success } = res.data
                    this.setState({
                        name_err: errs !== undefined
                            ? errs.name
                            : "",
                        title_err: errs !== undefined
                            ? errs.title
                            : "",
                        price_err: errs !== undefined
                            ? errs.price
                            : "",
                        offre_err: errs !== undefined
                            ? errs.offre
                            : "",
                        countInstock_err: errs !== undefined
                            ? errs.countInStock
                            : "",
                        description_err: errs !== undefined
                            ? errs.description
                            : "",
                        category_err: errs !== undefined
                            ? errs.category
                            : "",
                        details_err: errs !== undefined
                            ? errs.details
                            : "",
                        image_err: errs !== undefined
                            ? errs.image
                            : "",
                        sucess_err: errs !== undefined
                            ? errs.err
                            : "",
                        success_suc: success !== undefined
                            ? success.success
                            : "",

                    })
                    setTimeout(() => {
                        if (this.state.success_suc !== "") {
                            window.location = "/product"
                        } else {
                            this.setState({
                                name_err: "",
                                title_err: "",
                                price_err: "",
                                offre_err: "",
                                countInstock_err: "",
                                category_err: "",
                                description_err: "",
                                details_err: "",
                                image_err: "",
                                sucess_err: "",
                                success_suc: "",
                            })
                        }

                    }, 2000);
                });
        } catch (err) { console.log(err) }
    }

    render() {

        return (
            <>
                <div className="container w-75 mb-3 mt-4 h5 pt-4 ">
                    {this.state.success_suc && <div className="success-message1"><i className="fas fa-check"></i>{this.state.success_suc}</div>}
                    {this.state.success_err && <div className="err-message1"><i className="fas fa-times"></i>{this.state.success_err}</div>}

                    <h3>Add new prodauct </h3>
                    <form onSubmit={this.onSubmit}>

                        <div className="form-group row mb-2">
                            <label className="col-sm-3 col-form-label">name</label>
                            <div className="col-sm-9 ">
                                <input
                                    type="text"
                                    className="form-control "
                                    value={this.state.name}
                                    onChange={this.onChangename} />
                                {this.state.name_err && <div className="err-message1"><i className="fas fa-times"></i>{this.state.name_err}</div>}
                            </div>
                        </div>

                        <div className="form-group row mb-2">
                            <label className="col-sm-3 col-form-label">title</label>
                            <div className="col-sm-9">
                                <textarea
                                    type="text"
                                    className="form-control"
                                    value={this.state.title}
                                    onChange={this.onChangetitle}
                                    style={{ minHeight: "90px", color: this.state.color1 }} />
                                {this.state.title_err && <div className="err-message1"><i className="fas fa-times"></i>{this.state.title_err}</div>}
                            </div>
                        </div>

                        <div className="form-group row mb-2">
                            <label className="col-sm-3 col-form-label">Price</label>
                            <div className="col-sm-9">                 <input
                                type="text"
                                className="form-control"
                                value={this.state.price}
                                onChange={this.onChangeprice} />
                                {this.state.price_err && <div className="err-message1"><i className="fas fa-times"></i>{this.state.price_err}</div>}

                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label className="col-sm-3 col-form-label">Offre</label>
                            <div className="col-sm-9">                 <input
                                type="text"
                                className="form-control"
                                value={this.state.offre}
                                onChange={this.onChangeoffre} />
                                {this.state.offre_err && <div className="err-message1"><i className="fas fa-times"></i>{this.state.offre_err}</div>}

                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label className="col-sm-3 col-form-label">In Stock</label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.countInStock}
                                    onChange={this.onChangecountInStok} />
                                {this.state.countInstock_err && <div className="err-message1"><i className="fas fa-times"></i>{this.state.countInstock_err}</div>}

                            </div>
                        </div>

                        <div className="form-group row mb-2">
                            <label className="col-sm-3 col-form-label">category</label>

                            <div className="col-sm-9">
                                <select className="form-control " onChange={this.onChangecategory}>
                                    {[...this.state.categorys].map(x => (
                                        <option key={x.category} value={x.category}>{x.category}</option>
                                    ))}
                                </select>
                            </div>
                            {this.state.category_err && <div className="err-message1"><i className="fas fa-times"></i>{this.state.category_err}</div>}

                        </div>

                        <div className="form-group row mb-2">
                            <label className="col-sm-3 col-form-label">Description</label>
                            <div className="col-sm-9">
                                <textarea
                                    type="text"
                                    className="form-control"
                                    value={this.state.description}
                                    onChange={this.onChangeDescription}
                                    style={{ minHeight: "150px", color: this.state.color }}

                                />
                                {this.state.description_err && <div className="err-message1"><i className="fas fa-times"></i>{this.state.description_err}</div>}

                            </div>
                        </div>
                        <hr />
                        <h5>Add details</h5>
                        <div className="form-group row mb-2 mt-4 pt-4 mb-4 pb-4">

                            <div className="col-sm-3 mb-1 ">
                                {(this.state.detail && this.state.detail1)
                                    ? <button type="button" className="btn btn-success but" onClick={this.handledetails}>Add</button>
                                    : <button type="button" className="btn btn-success but disabled" onClick={this.handledetails}>Add</button>
                                }
                            </div>
                            <div className="col-sm-4 mt-1">
                                <input
                                    type="text"
                                    placeholder="Quality"
                                    className="form-control"
                                    value={this.state.detail}
                                    onChange={this.onChangedetail} />
                            </div>
                            <div className="col-sm-4 mt-1">
                                <input
                                    type="text"
                                    placeholder="value"
                                    className="form-control"
                                    value={this.state.detail1}
                                    onChange={this.onChangedetail1} />
                            </div>
                        </div>
                        <div className="form-group row mb-2">
                            <label className="col-sm-3 col-form-label">Product details:</label>
                            <div className="col-sm-9">
                                <div >
                                    <table className="ta table table-dark">
                                        <thead>
                                            <tr>
                                                <th> Quality</th>
                                                <th> Value</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.details.map((value, index) => (
                                                <tr key={index}>
                                                    <td style={{width:"20%"}}>{value.qty}</td>
                                                    <td style={{width:"70%"}}>{value.value}</td>
                                                    <td style={{width:"10%", textAlign:"end"}}><div className="del-c" onClick={()=>this.handleitems(index)}><i className="fas fa-times"></i></div></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {this.state.details_err && <div className="err-message1"><i className="fas fa-times"></i>{this.state.details_err}</div>}
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="form-group row mb-2">
                            <label className="col-sm-3 col-form-label">image</label>
                            <div className="col-sm-9">
                                <input
                                    type="file"
                                    accept="image/png, image/gif, image/jpeg , image/HEIC"
                                    multiple
                                    className="form-control"
                                    onChange={this.onChangeimage} />
                                {this.state.image_err && <div className="err-message1"><i className="fas fa-times"></i>{this.state.image_err}</div>}

                            </div>
                        </div>

                        <div className="form-group row mt-3">
                            <label className="col-sm-3 col-form-label"></label>
                            <div className="col-sm-9">
                                <input type="submit" value="ADD PRODUCT" className="btn btn-primary" />
                            </div>
                        </div>
                    </form>
                </div>
                <Fotter2 />
            </>
        )
    }
}
export default Addproduct;