import React, {Component} from "react";
import {Link} from "react-router-dom";
import Table from "react-bootstrap/Table";
import {Button, Spinner} from "react-bootstrap";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {AiFillEye, AiOutlineLink, BsFillPencilFill} from "react-icons/all";

class WebsiteDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: {},
            website: {},
            isActive: false,
        }
    }

    componentDidMount() {
        const {id} = this.props.match.params;

        axios.get(`/websites/${id}`).then(response => {
            this.setState({
                pages: response.data.pages,
                website: {
                    name: response.data.name,
                    id: response.data.id,
                    description: response.data.description,
                    url: response.data.url,
                    image: response.data.image,
                },
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


    handlePageDetail = (detailPage) => {
        this.setState({
            page: detailPage,
            detailPage: true
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

        if (Object.keys(this.state.pages).length === 0) {
            return (

                <div className="row">
                    <div className="col-md-2">
                    </div>

                    <div className="col-md-10 mt-5">
                        <h2>No pages available</h2>
                    </div>
                </div>
            )
                ;
        }

        if (Object.keys(this.state.pages).length === 0) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-md-2">
                        </div>

                        <div className="col-md-10 mt-5">
                            <h2>Select a website in the sidebar</h2>
                        </div>
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
                    {/*<td><a href={page.url + "/edit"}><BsFillPencilFill/></a></td>*/}
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

                                <h1>{this.state.website.name}</h1>
                                <p>{this.state.website.description}</p>
                            </div>
                            <div className="col-md-4 mt-5">
                                <img className="logo" src={this.state.website.image} alt=""/>
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
                                    value={this.state.website.id}
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
                                                {/*<th>Edit</th>*/}
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

export default WebsiteDetail;
