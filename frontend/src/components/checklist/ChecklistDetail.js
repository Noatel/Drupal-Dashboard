import React, {Component} from "react";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {Breadcrumb, ListGroup, Spinner} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import Table from "react-bootstrap/Table";
import {BsCircleFill} from "react-icons/all";
import {IconContext} from "react-icons";


class ChecklistDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            website: null,
            isActive: false
        };
    }

    componentDidMount() {
        const {id} = this.props.match.params;

        axios.get(`/websites/${id}/`).then(website => {
            console.warn(website.data)
            this.setState({
                website: website.data,
                isActive: true,
            })
        }).catch(error => {
            toastOnError(error);
        });
    }

    render() {
        if (!this.state.isActive) {
            return (<div className="spinner-div">
                <Spinner animation="border" role="status" className="spinner">
                </Spinner>
            </div>)
        }

        let tasks
        if (this.state.website.checklist[0].task) {
            if (this.state.website.checklist[0].task.length > 0) {
                tasks = this.state.website.checklist[0].task.map((task, i) => {
                        task.status = task.status.match(/'([^']+)'/)[1]
                        task.type = task.type.match(/'([^']+)'/)[1]
                        task.type = task.type.charAt(0) + task.type.substring(1).toLowerCase();

                        let status = null;
                        // Change to the last one in the array
                        if (task.status === 'NOT_ACITVE') {
                            status = 'grey'
                        } else if (task.status === 'SUCCESS') {
                            status = 'green'
                        } else if (task.status === 'FAILED') {
                            status = 'red'
                        }
                        return (
                            <tr key={task.id}>
                                <td><p style={{textTransform: 'capitalize'}}> {task.type}</p></td>
                                <td><p>{task.comment}</p></td>
                                <td>
                                    <IconContext.Provider value={{color: status, textAlign: "center"}}>
                                        <BsCircleFill/>
                                    </IconContext.Provider>
                                </td>
                            </tr>
                        );
                    }
                );
            }
        }

        return (

            <div className="container">
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-6 mt-5">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/clients">Clients</Breadcrumb.Item>
                            <Breadcrumb.Item active>Checklist</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-10 mt-5">
                        <div>
                            <h2>Checklist</h2>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Comment</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tasks}
                                </tbody>
                            </Table>
                            <ListGroup as="ul">
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </div>)
            ;
    }
}


export default withRouter(ChecklistDetail);

