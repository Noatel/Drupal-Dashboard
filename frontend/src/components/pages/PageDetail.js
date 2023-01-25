import React, {Component} from "react";
import Table from "react-bootstrap/Table";
import {AiFillExperiment, AiFillEye,} from "react-icons/all";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {Spinner} from "react-bootstrap";

class PageDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: null,
            page: {
                name: "",
                url: "",
            },
            isActive: false,
        };

        this.handlePageDetail = this.handlePageDetail.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
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
                return (<tr key={block.id}>
                        <td><p style={{textTransform: 'capitalize'}}>{block.name.split('-').join(' ')}  </p></td>
                        <td><p>{block.type}</p></td>
                        <td>
                            <a href="/" onClick={(event) => {
                                event.preventDefault();
                                this.handleShow(block.id)
                            }}>
                                <AiFillEye/>
                            </a>

                            <Modal show={this.state.show === block.id}
                                   onHide={this.handleClose}
                                   dialogClassName="modal-90w"
                                   className="modal"
                                   aria-labelledby="example-custom-modal-styling-title"
                                   fullscreen='sm-down'>
                                <Modal.Header closeButton>
                                    <Modal.Title id="example-custom-modal-styling-title">
                                        Custom Modal Styling
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <div className="col-md-6">

                                        </div>
                                        <div className="col-md-6" style={{whiteSpace: 'pre-wrap'}}>
                                            {block.content[0].content}
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </td>
                        <td>
                            <AiFillExperiment/>
                        </td>
                    </tr>
                );
            });
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-6 mt-5">
                        <h1>{this.state.page.name}</h1>
                        <p>{this.state.page.url}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                    </div>

                    <div className="col-md-10 mt-5">
                        <h2 className="d-inline-block">content blocks:</h2>
                        <div className="row">
                            <div className="col-md-12">
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Content</th>
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


export default PageDetail;

