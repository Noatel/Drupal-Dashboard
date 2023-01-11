import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {getBlocksByPageId} from "./PageActions";
import Table from "react-bootstrap/Table";
import {AiFillEye,} from "react-icons/all";
import Modal from "react-bootstrap/Modal";
import SanitizedHTML from 'react-sanitized-html';

class PageDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: null
        };

        this.handlePageDetail = this.handlePageDetail.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    componentDidMount() {
        let page = this.props.page;

        page.blocks.map(block => {
            block.show = false
        });

        this.props.getBlocksByPageId(page.id);
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
        const {page} = this.props

        let blocks = page.blocks.map(block => {
            return (
                <tr key={block.id}>
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
                                        <div dangerouslySetInnerHTML={{__html: block.content[0].content}}/>
                                    </div>
                                    <div className="col-md-6" style={{whiteSpace: 'pre-wrap'}}>
                                        {block.content[0].content}
                                    </div>
                                </div>


                            </Modal.Body>
                        </Modal>
                    </td>
                </tr>
            );
        });


        return (
            <div>
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-6 mt-5">
                        <h1>{page.name}</h1>
                        <p>{page.url}</p>
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

PageDetail.propTypes = {
    pages: PropTypes.object,
    onPageDetail: PropTypes.any,
};

const mapStateToProps = state => ({
    pages: state.page
});

export default connect(mapStateToProps, {
    getBlocksByPageId
})(withRouter(PageDetail));
