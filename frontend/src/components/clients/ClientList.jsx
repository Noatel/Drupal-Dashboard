import React, {Component} from "react";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import Table from "react-bootstrap/Table";
import {GoChecklist} from "react-icons/go";
import {AiFillEye, AiFillSetting} from "react-icons/ai";
import {Link} from "react-router-dom";
import {Spinner} from "react-bootstrap";

class ClientsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            websites: [],
            isActive: false,
        };
    }

    componentDidMount() {
        axios.get("/websites/").then(response => {
            this.setState({
                websites: response.data.results,
                isActive: true
            })
        }).catch(error => {
            toastOnError(error);
        });
    }

    render() {
        if (!this.state.isActive) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="spinner-div">
                            <Spinner animation="border" role="status" className="spinner">
                            </Spinner>
                        </div>
                    </div>
                </div>
            )
        }
        if (this.state.websites) {
            let items = this.state.websites.map(website => {
                return (
                    <tr key={website.id}>
                        <td>
                            <Link to={"/website/" + website.id} key={website.id} className={''}>
                                {website.name}
                            </Link>
                        </td>
                        <td>
                            <Link to={"/settings/"}>
                                <AiFillSetting/>
                            </Link>
                        </td>
                        <td>
                            <Link to={"/clients/website/" + website.id} key={website.id}>
                                <GoChecklist/>
                            </Link>
                        </td>
                        <td>
                            <Link to={"/website/" + website.id} key={website.id}>
                                <AiFillEye/>
                            </Link>
                        </td>
                        <td>{website.created_at}</td>
                    </tr>
                )
            });
            return (
                <div className="row">
                    <div className="col-md-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className={" header-card"}>Overview clients:</h4>
                                <Table className={"table"}>
                                    <thead className=" thead-page">
                                    <tr>
                                        <th>Name</th>
                                        <th>Settings</th>
                                        <th>Checklist</th>
                                        <th>View</th>
                                        <th>Date added</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {items}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>

                </div>
            )
                ;
        }
        return (
            <div className="mt-5">
                <h2>No clients</h2>
                <hr/>
            </div>
        );
    }
}


export default ClientsList;