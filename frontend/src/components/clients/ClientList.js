import React, {Component} from "react";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import Table from "react-bootstrap/Table";
import {AiFillEye, AiFillSetting, GoChecklist} from "react-icons/all";
import {Link} from "react-router-dom";
import {Spinner} from "react-bootstrap";

class ClientsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            websites: {},
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
                <div className="spinner-div">
                    <Spinner animation="border" role="status" className="spinner">
                    </Spinner>
                </div>
            )
        }

        if (this.state.websites.length > 0) {
            let items = this.state.websites.map(website => {
                return (
                    <tr key={website.id}>
                        <td colSpan={4}>{website.name}</td>
                        <td><AiFillSetting/></td>
                        <td>
                             <Link to={"/clients/website/" + website.id } key={website.id}>
                                <GoChecklist/>
                            </Link>
                        </td>
                        <td>
                            <Link to={"/website/" + website.id} key={website.id}>
                                <AiFillEye/>
                            </Link>
                        </td>
                    </tr>
                )
            });
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-md-2">
                        </div>
                        <div className="col-md-10 mt-5">
                            <h1>Clients</h1>
                            <div className="mt-5">
                                <Table>
                                    <thead className="thead-page">
                                    <tr>
                                        <th colSpan={4}>Name</th>
                                        <th>Settings</th>
                                        <th>Checklist</th>
                                        <th>View</th>
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
            );
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
