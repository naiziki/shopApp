import './category.css';
import axios from 'axios';
import React, { Component } from 'react';
import Fotter2 from '../components/Fotter2'

class editCategory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category: '',
            image: '',
            imaerr: "",
            catyerr: "",
            success: "",
        }
    }
    componentDidMount() {
        axios.get('/api/category/' + this.props.match.params.id)
            .then(response => this.setState({
                category: response.data.category,
                slage: response.data.slage,
                image: response.data.image
            }))
            .catch((error) => console.log(error))
    }

    //onChangecategory = e => this.setState({ category: e.target.value });
    onChangeimage = e => this.setState({ image: e.target.files[0] });


    onSubmit = e => {
        e.preventDefault();
        const formdata = new FormData()
        const caty = {
            category: this.state.category,
            image: this.state.image,
        }
        for (var x in caty) {
            formdata.append(x, caty[x])
        }
        try {
            axios
                .post("/api/category/update/" + this.props.match.params.id, formdata)
                .then(res =>{ 
                    this.setState({
                        imaerr: res.data.errs !== undefined
                            ? res.data.errs.image
                            : "",
                        catyerr: res.data.errs !== undefined
                            ? res.data.errs.category
                            : "",
                        success: res.data.success !== undefined
                            ? res.data.success.category
                            : "",
                    })

                    setTimeout(() => {
                        if (this.state.success) {
                            window.location = "/category"
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
    render() {
        return (
            <>
                <div className="container w-50 mb-3 b">
                {this.state.success && <div className="success-message"><i className="fas fa-check"></i>{this.state.success}</div>}
                    <h3> Update Category </h3>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Category </label>
                            <input
                                type="text"
                                disabled
                                className="form-control"
                                value={this.state.category}/>
                        </div>
                        {this.state.catyerr && <div className="err-message"><i className="fas fa-times"></i>{this.state.catyerr}</div>}
                        <div className="form-group">
                            <label>Image </label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/png, image/gif, image/jpeg , image/HEIC"
                                onChange={this.onChangeimage} />
                        </div>
                        {this.state.imaerr && <div className="err-message"><i className="fas fa-times"></i>{this.state.imaerr} </div>}
                        <div className="form-group mt-3">
                            <input type="submit" value="UPDATE CATEGORY" className="btn btn-primary" />
                        </div>
                    </form>
                </div>
                <Fotter2 />
            </>
        )
    }
}
export default editCategory;