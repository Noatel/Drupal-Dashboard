import React, {Component} from "react";
import Table from "react-bootstrap/Table";
import {AiFillExperiment, AiFillEye, BsCircleFill} from "react-icons/all";
import {IconContext} from "react-icons";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {Accordion, Breadcrumb, Card, Spinner} from "react-bootstrap";
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
            results: null,
            isActive: false,
        };

        this.handlePageDetail = this.handlePageDetail.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleShowHistory = this.handleShowHistory.bind(this);
        this.handleCloseHistory = this.handleCloseHistory.bind(this);
        this.returnTable = this.returnTable.bind(this);
    }

    componentDidMount() {
        const {id} = this.props.match.params;

        axios.get(`/pages/?page_id=${id}&blocks=true`).then(response => {
            this.setState({
                page: response.data[0],
            })
        }).catch(error => {
            toastOnError(error);
        });

        axios.get(`/pages/${id}/results`).then(response => {
            this.setState({
                results: response.data[0],
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

    returnTable(result) {
        return (<tr key={result.id}>
            <td>{result.attribute}  </td>
            <td><p>{result.value}</p></td>
            <td>{result.className}</td>
        </tr>);
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

        let resultsHeaders = [];
        let resultsIds = [];
        let resultsAlts = [];

        this.state.results.page_results.forEach(result => {
            if (result.attribute === 'h1') {
                resultsHeaders.push(result)
            } else if (result.attribute === 'id') {
                resultsIds.push(result)
            } else if (result.attribute === 'alt') {
                resultsAlts.push(result)
            }
        });
        
        const statusHeader = resultsHeaders.length > 0 ? 'red' : 'green'
        const statusId = resultsIds.length > 0 ? 'red' : 'green'
        const statusAlt = resultsAlts.length > 0 ? 'red' : 'green'


        resultsHeaders = resultsHeaders.map(result => {
            return (this.returnTable(result));
        });

        resultsIds = resultsIds.map(result => {
            return (this.returnTable(result));
        });

        resultsAlts = resultsAlts.map(result => {
            return (this.returnTable(result));
        });

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
                            <input type="name" className=" form-control" readOnly={true} id="name"
                                   value={this.state.page.name}/>
                        </div>
                        <div className=" form-group">
                            <label htmlFor=" url">Url:</label>
                            <input type=" url" className=" form-control" readOnly={true} id="url"
                                   value={this.state.page.url}/>
                        </div>
                    </div>
                </div>
                <div className=" row">
                    <div className=" col-md-2">
                    </div>

                    <div className=" col-md-10 mt-5">
                        <h2 className=" d-inline-block">SEO to perfection:</h2>
                        <p>
                            For the website to reach a high SEO, it need to follow a couple rules
                        </p>
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="1">
                                    There can only be <u>1</u> H1 on a page
                                    <div className="statusIcon">
                                        <IconContext.Provider value={{color: statusHeader, textAlign: "center"}}>
                                            <BsCircleFill/>
                                        </IconContext.Provider>
                                    </div>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <div className=" row">
                                            <div className=" col-md-12">
                                                {resultsHeaders.length > 0 ?
                                                    <div>
                                                        <h4>There is no repeated ID's being used</h4>
                                                        <Table className="tableBlock" striped bordered hover
                                                               size="sm">
                                                            <thead className="thead-page">
                                                            <tr>
                                                                <th>Type</th>
                                                                <th>Name</th>
                                                                <th>Class</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {resultsHeaders}
                                                            </tbody>
                                                        </Table>
                                                    </div> : <p> is only 1 H1 on the webpage! </p>}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="1">
                                    There is no repeated ID's being used
                                    <div className="statusIcon">
                                        <IconContext.Provider value={{color: statusId, textAlign: "center"}}>
                                            <BsCircleFill/>
                                        </IconContext.Provider>
                                    </div>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <div className=" row">
                                            <div className=" col-md-12">
                                                {resultsIds.length > 0 ?
                                                    <div>
                                                        <Table className="tableBlock" striped bordered hover size="sm">
                                                            <thead className="thead-page">
                                                            <tr>
                                                                <th>Type</th>
                                                                <th>Name</th>
                                                                <th>Class</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {resultsIds}
                                                            </tbody>
                                                        </Table>
                                                    </div> : <p> There are no duplicate ID's on this page!</p>}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="1">
                                    Image need <u>alt</u> text
                                    <div className="statusIcon">
                                        <IconContext.Provider value={{color: statusAlt, textAlign: "center"}}>
                                            <BsCircleFill/>
                                        </IconContext.Provider>
                                    </div>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <div className=" row">
                                            <div className=" col-md-12">
                                                {resultsAlts.length > 0 ?
                                                    <div>
                                                        <Table className="tableBlock" striped bordered hover
                                                               size="sm">
                                                            <thead className="thead-page">
                                                            <tr>
                                                                <th>Type</th>
                                                                <th>Name</th>
                                                                <th>Class</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {resultsAlts}
                                                            </tbody>
                                                        </Table>
                                                    </div> : <p> All Alt text are filled in correctly! </p>}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </div>
                </div>
                <div className=" row">
                    <div className=" col-md-2">
                    </div>
                    <div className=" col-md-10 mt-5">
                        <h2 className=" d-inline-block">Content blocks:</h2>
                        <p>The Drupal custom blocks that exsist on the page <br/>
                            You can check out the content what is in the block or the tests results (If there is
                            any)
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
