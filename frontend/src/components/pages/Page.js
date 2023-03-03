import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { AiFillExperiment, AiFillEye, BsChevronDown, BsChevronUp, BsCircleFill } from "react-icons/all";
import { IconContext } from "react-icons";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { toastOnError } from "../../utils/Utils";
import { Accordion, Breadcrumb, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

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

            openHeader: false,
            openId: false,
            openAlt: false,
            openOrder: false,
        };

        this.handlePageDetail = this.handlePageDetail.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleShowHistory = this.handleShowHistory.bind(this);
        this.handleCloseHistory = this.handleCloseHistory.bind(this);
        this.returnTable = this.returnTable.bind(this);

        this.openHeader = this.openHeader.bind(this);
        this.openAlt = this.openAlt.bind(this);
        this.openId = this.openId.bind(this);
        this.openOrder = this.openOrder.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;

        axios.get(`/pages/${id}/blocks`).then(response => {
            this.setState({
                page: response.data[0],
            })
        }).catch(error => {
            toastOnError(error);
        });

        axios.get(`/results/?page_id=${id}`).then(response => {

            this.setState({
                results: response.data,
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

    openHeader(state) {
        this.setState({
            openHeader: state
        })
        return state
    }

    openAlt(state) {
        this.setState({
            openAlt: state
        })
        return state
    }

    openId(state) {
        this.setState({
            openId: state
        })
        return state
    }

    openOrder(state) {
        this.setState({
            openOrder: state
        })
        return state
    }

    returnTable(result) {
        return (<tr key={result.id}>
            <td>{result.attribute}  </td>
            <td><p>{result.page_value.value}</p></td>
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
        let resultsOrders = [];

        let metaTitle = "";
        let metaDescription = "";

        let statusHeader = 'grey'
        let statusId = 'grey'
        let statusAlt = 'grey'
        let statusOrders = 'grey'
        let descriptionColor = 'grey'
        let titleColor = 'grey'

        if (this.state.results.length > 0) {
            this.state.results.forEach(result => {
                if (result.attribute === 'h1') {
                    resultsHeaders.push(result)
                } else if (result.attribute === 'id') {
                    resultsIds.push(result)
                } else if (result.attribute === 'alt') {
                    resultsAlts.push(result)
                } else if (result.attribute === 'order') {
                    resultsOrders.push(result)
                } else if (result.attribute === 'meta') {
                    metaTitle = result.page_value.value[0];
                    metaDescription = result.page_value.value[1];
                    descriptionColor = metaDescription.length > 0 ? 'green' : 'red'
                    titleColor = metaTitle.length > 0 ? 'green' : 'red'
                }
            });

            statusHeader = resultsHeaders.length > 0 ? 'red' : 'green'
            statusId = resultsIds.length > 0 ? 'red' : 'green'
            statusAlt = resultsAlts.length > 0 ? 'red' : 'green'
            statusOrders = resultsOrders.length > 0 ? 'red' : 'green'


            resultsHeaders = resultsHeaders.map(result => {
                return (this.returnTable(result));
            });

            resultsIds = resultsIds.map(result => {
                return (this.returnTable(result));
            });

            resultsAlts = resultsAlts.map(result => {
                return (this.returnTable(result));
            });

            resultsOrders = resultsOrders.map(result => {
                return (this.returnTable(result));
            });
        }
        return (
            <div className=" container">
                <div className="row">
                    <div className="col-md-12">
                         <Breadcrumb>
                            <Breadcrumb.Item href="/clients">Clients</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={this.props.history.goBack}>Website details</Breadcrumb.Item>
                            <Breadcrumb.Item active>Page details</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="row">
                    <div className=" col-md-6">
                        <h2>Page information</h2>
                        <div className="display-card">
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
                              <div className="display-card mt-4">
                            <p> Page speed </p>  
                             <div className=" form-group">
                                <label htmlFor=" url"></label>
                                <input type=" url" className=" form-control" readOnly={true} id="url"
                                       value={"300ms"}/>
                            </div>

                        </div>
                    </div>

                    <div className="col-md-6 mt-5">
                        <div className="form-group display-card">
                            <label htmlFor="meta_title">
                                <div className="statusIcon">
                                    <IconContext.Provider value={{color: titleColor, textAlign: "center"}}>
                                        <BsCircleFill/>
                                    </IconContext.Provider>
                                </div>
                                Meta title:</label>
                            <input type="meta_title" className=" form-control" readOnly={true} id="url"
                                   defaultValue={metaTitle}/>
                        </div>
                        <div className="display-card">
                        <label htmlFor="meta_description">
                            <div className="statusIcon">
                                <IconContext.Provider value={{color: descriptionColor, textAlign: "center"}}>
                                    <BsCircleFill/>
                                </IconContext.Provider>
                            </div>
                            Meta description:</label>
                        <textarea className="form-control" name="meta_description" id="" cols="30" rows="10" disabled
                                  value={metaDescription}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mt-5">
                        <div className="display-card">
                        <h2 className=" d-inline-block">SEO to perfection:</h2>
                        <p>
                            For the website to reach a high SEO, it need to follow a couple rules
                        </p>
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="1"
                                                  onClick={() => this.openHeader(!this.state.openHeader)}>
                                    <div className="statusIcon">
                                        <IconContext.Provider value={{color: statusHeader, textAlign: "center"}}>
                                            <BsCircleFill/>
                                        </IconContext.Provider>
                                    </div>
                                    There can only be <u>1</u> H1 on a page
                                    {this.state.openHeader ? <BsChevronUp className="accordian-drop"/> :
                                        <BsChevronDown className="accordian-drop"/>}
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
                                <Accordion.Toggle as={Card.Header} eventKey="1"
                                                  onClick={() => this.openId(!this.state.openId)}>
                                    <div className="statusIcon">
                                        <IconContext.Provider value={{color: statusId, textAlign: "center"}}>
                                            <BsCircleFill/>
                                        </IconContext.Provider>
                                    </div>
                                    There is no repeated ID's being used
                                    {this.state.openId ? <BsChevronUp className="accordian-drop"/> :
                                        <BsChevronDown className="accordian-drop"/>}
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
                                <Accordion.Toggle as={Card.Header} eventKey="1"
                                                  onClick={() => this.openAlt(!this.state.openAlt)}>

                                    <div className="statusIcon">
                                        <IconContext.Provider value={{color: statusAlt, textAlign: "center"}}>
                                            <BsCircleFill/>
                                        </IconContext.Provider>
                                    </div>
                                    Image need <u>alt</u> text
                                    {this.state.openAlt ? <BsChevronUp className="accordian-drop"/> :
                                        <BsChevronDown className="accordian-drop"/>}
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
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="1"
                                                  onClick={() => this.openOrder(!this.state.openOrder)}>
                                    <div className="statusIcon">
                                        <IconContext.Provider value={{color: statusOrders, textAlign: "center"}}>
                                            <BsCircleFill/>
                                        </IconContext.Provider>
                                    </div>
                                    Headers need to be alphanumerics (h1, h2, h3, h4, h5, h6)
                                    {this.state.openOrder ? <BsChevronUp className="accordian-drop"/> :
                                        <BsChevronDown className="accordian-drop"/>}
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <div className=" row">
                                            <div className=" col-md-12">
                                                {resultsOrders.length > 0 ?
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
                                                            {resultsOrders}
                                                            </tbody>
                                                        </Table>
                                                    </div> : <p> The order of the headers is done correctly! </p>}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </div>
                    </div>
                </div>
                <div className=" row">
                    <div className=" col-md-12 mt-5">
                        <div className="display-card">
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
                    </div>
                    <hr/>
                </div>
            </div>
        );
    }
}

export default Page;