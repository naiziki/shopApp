import './category.css'
import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Fotter2 from "../components/Fotter2"

class Category extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category: '',
            data: '',
            categorys: [],
            imaerr: "",
            catyerr: "",
            success: "",
        }
    }
    componentDidMount() {
        axios.get('/api/category')
            .then(response => this.setState({ categorys: response.data }))
            .catch((error) => console.log(error))
    }

    onChangecategory = e => {
        if (e.target.value.length <= 15) this.setState({ category: e.target.value })
    }
    
    onChangeimage = e => this.setState({ data: e.target.files[0] })

    onSubmit = async e => {
        e.preventDefault();
        const formdata = new FormData()
        const category = {
            category: this.state.category,
            image: this.state.data.name,
            file: this.state.data
        }
        for (var x in category) {
            formdata.append(x, category[x])  
        }
        try {
            axios
                .post("/api/category", formdata)
                .then(res => {
                    const { errs , success} = res.data    
                    this.setState({
                        imaerr: errs !== undefined
                            ? errs.image
                            : "",
                        catyerr: errs !== undefined
                            ? errs.category
                            : "",
                        success: success !== undefined
                            ? success.category
                            : "",
                    })
                    setTimeout(() => {
                        if (this.state.success) {
                            window.location = "/product"
                        } else {
                            this.setState({
                                imaerr: "",
                                catyerr: "",
                                success: "",
                            });
                        }
                    }, 2000);
                });
        } catch (err) { console.log(err) }
    }
    deletecategory(category) {
        axios
            .post("/api/category/" + category)
            .then(res => {
                console.log(res.data.success)
                this.setState({
                    success: res.data.success !== undefined
                        ? res.data.success
                        : ""
                })
                setTimeout(() => {
                    this.setState({
                        success: ""
                    })
                }, 2000)
            });
        this.setState({ categorys: this.state.categorys.filter(el => el.category !== category) })
    }

    render() {
    
        var data = this.state.categorys;
        return (
            <>
                <div className="container w-75 mb-3 b">
                    {this.state.success && <div className="success-message"><i className="fas fa-check"></i>{this.state.success}</div>}
                    <h3>Add new Category </h3>
                    <form onSubmit={this.onSubmit}>

                        <div className="form-group">
                            <label>Category </label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.category}
                                onChange={this.onChangecategory} />
                        </div>
                        {this.state.catyerr && <div className="err-message"><i className="fas fa-times"></i>{this.state.catyerr}</div>}
                        <div className="form-group">
                            <label>Image </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/png, image/gif, image/jpeg , image/HEIC"
                                className="form-control"
                                onChange={this.onChangeimage}
                            />
                        </div>
                        {this.state.imaerr && <div className="err-message"><i className="fas fa-times"></i>{this.state.imaerr} </div>}
                        <div className="form-group mt-3">
                            <input type="submit" value="ADD CATEGORY" className="btn btn-primary" />
                        </div>
                    </form>
                    <hr />
                    <br />

                    <h3>your Ctegories</h3>
                    <div className="tbl">
                        <table className="ta table table-dark">
                            <thead>
                                <tr>
                                    <th> Catygory</th>
                                    <th> Edit </th>
                                    <th> Remove </th>

                                </tr>
                            </thead>
                            <tbody>
                                {data.map((value, index) => (
                                    <tr key={index}>
                                        <td>{value.category}</td>
                                        <td>
                                            <Link to={"/editCategory/" + value._id} className="text-decoration-none l">Edit</Link>
                                        </td>
                                        <td>
                                            <Link className="l" to="#" onClick={() => this.deletecategory(value.category)}>Remove</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
                <Fotter2 />
            </>
        )
    }
}
export default Category;