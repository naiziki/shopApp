import './addcompany.css'
import axios from 'axios';
import React, { useState } from 'react';
import Fotter2 from "../components/Fotter2"

const Addcompany = () => {

    const [name, setname] = useState("");
    const [detail, setdetail] = useState("");
    const [video, setvideo] = useState("");

    const [nameerr, setnameerr] = useState("");
    const [detailerr, setdetailerr] = useState("");
    const [videoerr, setvideoerr] = useState("");
    const [success, setsuccess] = useState("");
    const [successerr, setsuccesserr] = useState("")

    const onchangename = (e) => {
        if (e.target.value.length < 20) {
            setname(e.target.value)
        }
    }

    const onchangedetails = (e) => {
        if (e.target.value.length < 1000) {
            setdetail(e.target.value)
        }
    }

    const onChangevideo = (e) => {
        setvideo(e.target.files[0])
    }


    const onSubmit = () => {
        const formdata = new FormData()
        const company = {
            name: name,
            detail: detail,
            imageUrl: video
        }
        for( var x in company){
            formdata.append(x,company[x])
        }

        try {
            axios
                .post("/api/company", formdata)
                .then(res => {
                    const { errs, success } = res.data
                    if (errs) {
                        if (errs.name) setnameerr(errs.name)
                        if (errs.detail) setdetailerr(errs.detail)
                        if (errs.video) setvideoerr(errs.video)
                    }
                    if (success) {
                        if (success.success) setsuccess(success.success)
                        if (success.err) setsuccesserr(success.err)
                    }
                    setTimeout(() => {
                        if (success) { 
                            window.location = "/product"
                        } else {
                            setnameerr("")
                            setdetailerr("")
                            setvideoerr("")
                        }
                    }, 2000);
                });
        } catch (err) { console.log(err) }
    }

    return (
        <>
            <div className="container w-75 mb-3 b">
                {success && <div className="success-message"><i className="fas fa-check"></i>{success}</div>}
                {successerr && <div className="err-message"><i className="fas fa-times"></i>{successerr}</div>}

                <h3>Company detail </h3>
                <form>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={onchangename} />
                        {nameerr && <div className="err-message"><i className="fas fa-times"></i>{nameerr}</div>}
                    </div>
                    <div className="form-group">
                        <label>details</label>
                        <textarea
                            type="text"
                            className="form-control"
                            value={detail}
                            onChange={onchangedetails}
                            style={{height:"200px"}}
                             />
                        {detailerr && <div className="err-message"><i className="fas fa-times"></i>{detailerr}</div>}
                    </div>
                    <div className="form-group">
                        <label>company image</label>
                        <input
                            type="file" 
                            className="form-control"
                            onChange={onChangevideo}
                        />
                        {videoerr && <div className="err-message"><i className="fas fa-times"></i>{videoerr}</div>}
                    </div>
                    <div className="form-group mt-3">
                        <input type="button" value="ADD COMPANY DETAIL" className="btn btn-primary" onClick={onSubmit} />
                    </div>
                </form>
            </div>
            <Fotter2 />
        </>
    )
}

export default Addcompany;