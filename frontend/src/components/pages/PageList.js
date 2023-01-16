import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import Table from "react-bootstrap/Table";
import {Button, Spinner} from "react-bootstrap";
import {scheduleWebsite} from "../website/WebsiteActions";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {AiFillEye, AiOutlineLink, BsFillPencilFill} from "react-icons/all";


class PageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: {},
            page: {},
            website: {},
            websites: [],
            isActive: false,
        }
    }

    componentDidMount() {
        const {id} = this.props.match.params;

        axios.get(`/pages?website_id=${id}`).then(response => {
            this.setState({
                pages: response.data,
                isActive: true,
            })
        }).catch(error => {
            toastOnError(error);
        });

    }

    onWebsiteClick = () => {
        const website = this.website.value;
        this.props.onWebsiteClick(website);
    }


    handleClick = (event) => {
        const id = event.target.value
        this.props.scheduleWebsite(id, {});
        // setLoading(true);
    };

    handlePageDetail = (detailPage) => {
        this.setState({
            page: detailPage,
            detailPage: true
        });
    }


    render() {
        let {website} = this.props.websites.website;

        if (!this.state.isActive) {
            return (
                <div className="spinner-div">
                    <Spinner animation="border" role="status" className="spinner">
                    </Spinner>
                </div>
            )
        }

        if (Object.keys(this.state.pages).length === 0 && website.id !== '' && !Array.isArray(this.props.websites.website)) {
            return (
                <div className="row">
                    <div className="col-md-2">
                    </div>

                    <div className="col-md-10 mt-5">
                        <h2>No pages available</h2>
                    </div>
                </div>
            );
        }

        let items = this.state.pages.map(page => {
            return (
                <tr key={page.id}>
                    <td><p
                        style={{textTransform: 'capitalize'}}>{page.name ? page.name.split('-').join(' ') : "None"}  </p>
                    </td>
                    <td><a href={page.url} target="_blank" rel="noopener noreferrer"><AiOutlineLink/></a></td>
                    <td><a href={page.url + "/edit"}><BsFillPencilFill/></a></td>
                    <td>
                        <Link to={"/page/" + page.id} key={page.id} page={page}>
                            <AiFillEye/>
                        </Link>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <div className="container">
                        <div>
                            <div className="row">
                                <div className="col-md-2">
                                </div>
                                <div className="col-md-6 mt-5">
                                    <h1>{website.name}</h1>
                                    <p>{website.description}</p>
                                </div>
                                <div className="col-md-4 mt-5">
                                    <img src={website.image} alt=""/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2">
                                </div>

                                <div className="col-md-10 mt-5">
                                    <h2 className="d-inline-block">Pages:</h2>
                                    <Button
                                        className="float-right"
                                        variant="primary"
                                        disabled={false}
                                        onClick={this.handleClick}
                                        value={website.id}
                                    >
                                        Schedule a test
                                    </Button>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <Table striped bordered hover>
                                                <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>URL</th>
                                                    <th>Edit</th>
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
                                <hr/>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}

PageList.propTypes = {
    pages: PropTypes.object,
    page: PropTypes.object,
    website: PropTypes.any,
    websites: PropTypes.any,
    detailPage: PropTypes.any,
};

const mapStateToProps = state => ({
    websites: state.websites,
    website: state.website,
    pages: state.pages,
    page: state.page,
    detailPage: false,
});

export default connect(mapStateToProps, {
    scheduleWebsite,
})(withRouter(PageList));
