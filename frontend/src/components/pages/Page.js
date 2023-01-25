import React, {Component} from "react";
import Table from "react-bootstrap/Table";
import {AiFillExperiment, AiFillEye, BsCircleFill} from "react-icons/all";
import {IconContext} from "react-icons";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {Breadcrumb, Spinner} from "react-bootstrap";
import {Link} from "react-router-dom";

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: null,
            showHistory: null,
            page: {
                name: "",
                url: "",
            },
            isActive: false,
        };

        this.handlePageDetail = this.handlePageDetail.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleShowHistory = this.handleShowHistory.bind(this);
        this.handleCloseHistory = this.handleCloseHistory.bind(this);
    }

    componentDidMount() {
        const {id} = this.props.match.params;

        axios.get(`/pages/?page_id=${id}&blocks=true`).then(response => {
            this.setState({
                page: response.data[0],
                isActive: true
            })
        }).catch(error => {
            toastOnError(error);
        });
    }


    handlePageDetail = () => {
        this.props.onPageDetail(true);
    }


    handleClose() {
        this.setState({
            show: 'close'
        });
        return false;
    }

    handleShow(id) {
        this.setState({
            show: id
        });
    }

    handleShowHistory(id) {
        this.setState({
            showHistory: id
        });
    }

    handleCloseHistory() {
        this.setState({
            showHistory: 'close'
        });
        return false;
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
        let blocks = null;
        if (this.state.page.url !== '') {
            blocks = this.state.page.blocks.map(block => {

                // Check if there are results
                let result = false;

                // Get the class of the status
                let status = null;
                if (block.results.length > 0) {
                    result = block.results
                    // Change to the last one in the array
                    if (block.results[block.results.length - 1].status === '1') {
                        status = 'green'
                    } else if (block.results[block.results.length - 1].status === '2') {
                        status = 'orange'
                    } else if (block.results[block.results.length - 1].status === '3') {
                        status = 'red'
                    }
                }

                return (
                    <tr key={block.id}>
                        <td className="tableData">
                            <IconContext.Provider value={{color: status, textAlign: "center"}}>
                                <BsCircleFill/>
                            </IconContext.Provider>
                        </td>
                        <td><p style={{textTransform: 'capitalize'}}>{block.name.split('-').join(' ')}  </p></td>
                        <td><p>{block.type}</p></td>
                        <td>
                            <a href="/" onClick={(event) => {
                                event.preventDefault();
                                this.handleShow(block.id)
                            }}>
                                <AiFillEye/>
                            </a>
                        </td>
                        <Modal show={this.state.show === block.id}
                               onHide={this.handleClose}
                               dialogClassName="modal-90w"
                               className="modal"
                               aria-labelledby="example-custom-modal-styling-title"
                               fullscreen='sm-down'>
                            <Modal.Header closeButton>
                                <Modal.Title id="example-custom-modal-styling-title">
                                    Block {block.name} details
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>Executed HTML code</p>
                                        <div dangerouslySetInnerHTML={{__html: block.content[0].content}}/>
                                    </div>
                                    <div className="col-md-6" style={{whiteSpace: 'pre-wrap'}}>
                                        <p>HTML Code:</p>
                                        <textarea className="form-control"
                                                  rows="20">
                                                {block.content[0].content}
                                            </textarea>
                                    </div>
                                </div>


                            </Modal.Body>
                        </Modal>
                        <td>
                            {result.length > 0 ?
                                <Link to={"/block/" + block.id + "/results"} key={block.id}>
                                    <AiFillExperiment/>
                                </Link>
                                :
                                <Link className="disable-link" to="#"
                                      key={block.id}>
                                    <AiFillExperiment/>
                                </Link>
                            }
                        </td>
                    </tr>);
            });
        }
        return (
            <div className=" container">
                <div className=" row">
                    <div className=" col-md-2">
                    </div>
                    <div className=" col-md-6 mt-5">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/clients">Clients</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={this.props.history.goBack}>Website details</Breadcrumb.Item>
                            <Breadcrumb.Item active>Page details</Breadcrumb.Item>
                        </Breadcrumb>

                        <h1>Page information</h1>
                        <p>
                            Some basic information about the current page <br/>
                            this includes currently the Drupal custom blocks and their tests
                        </p>
                        <div className=" form-group">
                            <label htmlFor=" name">Name:</label>
                            <input type=" name" className=" form-control" readOnly={true} id=" name"
                                   value={this.state.page.name}/>
                        </div>
                        <div className=" form-group">
                            <label htmlFor=" url">Url:</label>
                            <input type=" url" className=" form-control" readOnly={true} id=" url"
                                   value={this.state.page.url}/>
                        </div>
                    </div>
                </div>
                <div className=" row">
                    <div className=" col-md-2">
                    </div>

                    <div className=" col-md-10 mt-5">
                        <h2 className=" d-inline-block">Content blocks:</h2>
                        <p>The Drupal custom blocks that exsist on the page <br/>
                            You can check out the content what is in the block or the tests results (If there is any)
                        </p>
                        <ol>
                            <li>Green: Nothing changed</li>
                            <li>Orange: Something changed</li>
                            <li>Red: Block deleted</li>
                        </ol>
                        <div className=" row">
                            <div className=" col-md-12">
                                <Table className="tableBlock" striped bordered hover size="sm">
                                    <thead className="thead-page">
                                    <tr>
                                        <th>Status</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Content</th>
                                        <th>Tests</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {blocks}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
        );
    }
}

export default Page;
