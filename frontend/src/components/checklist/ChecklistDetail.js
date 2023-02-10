import React, {Component} from "react";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {Breadcrumb, Button, ListGroup, Spinner} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import Table from "react-bootstrap/Table";
import {BsCircleFill} from "react-icons/all";
import {IconContext} from "react-icons";
import {connect} from "react-redux";
import {scheduleChecklist} from "../website/WebsiteActions";
import PropTypes from "prop-types";


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

        axios.get(`/websites/${id}/check`).then(website => {
            this.setState({
                website: website.data[0],
                isActive: true,
            })
        }).catch(error => {
            toastOnError(error);
        });
    }

    handleClick = (event) => {
        const id = event.target.value
        this.props.scheduleChecklist(id, {});
        // setLoading(true);
    };

    render() {
        if (!this.state.isActive) {
            return (<div className="spinner-div">
                <Spinner animation="border" role="status" className="spinner">
                </Spinner>
            </div>)
        }
        let tasks
        if (this.state.website.checklist) {
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
                                    <td>{task.completed_at}</td>
                                </tr>
                            );
                        }
                    );
                }
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

                            <Button
                                className="float-right button-checklist"
                                variant="primary"
                                disabled={this.state.website.checklist[0].status === '0'}
                                onClick={this.handleClick}
                                value={this.state.website.id}
                            >
                                Rerun the checklist
                            </Button>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Comment</th>
                                    <th>Status</th>
                                    <th>Completed at</th>
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


ChecklistDetail.propTypes = {
    website: PropTypes.any,
};

const mapStateToProps = state => ({
    website: state.website,
});

export default connect(mapStateToProps, {
    scheduleChecklist,
})(withRouter(ChecklistDetail));

