import React, {Component} from "react";
import {Link} from "react-router-dom";
import Table from "react-bootstrap/Table";
import {Breadcrumb, Button, Spinner, Pagination} from "react-bootstrap";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {AiFillEye, AiOutlineLink, AiOutlineWarning, BsCircleFill, MdOutlineDone} from "react-icons/all";
import {IconContext} from "react-icons";
import {ADD_website} from "./WebsiteTypes";
import {toast} from "react-toastify";

class WebsiteDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: {},
            website: {},
            isActive: false,
            pageNumber: 1,
            maxLength: 0,
        }

        this.toPage = this.toPage.bind(this);
    }

    componentDidMount() {
        const {id} = this.props.match.params;

        axios.get(`/websites/${id}`).then(response => {
            this.setState({
                website: {
                    name: response.data.name,
                    id: response.data.id,
                    description: response.data.description,
                    url: response.data.url,
                    image: response.data.image,
                },
            })
        }).catch(error => {
            toastOnError(error);
        });


        axios.get(`/pages/?website_id=${id}`).then(response => {
            this.setState({
                maxLength: response.data.count,
                pages: response.data.results,
                isActive: true,
            })
        }).catch(error => {
            toastOnError(error);
        });
    }


    handleClick = (event) => {
        const id = event.target.value
        axios
            .post(`/websites/${id}/schedule/`)
            .then(response => {
                toast.success('Added test to schedule!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
            .catch(error => {
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

    loadPosts = (pageNumber) => {
        let url = `/pages/?page=${pageNumber}&website_id=${this.state.website.id}`
        axios.get(url)
            .then(response => {
                this.setState({
                    pages: response.data.results,
                    isActive: true,
                })
            }).catch(error => {
            toastOnError(error);
        });
    }

    toPage = (value) => {
        this.setState({
            pageNumber: value
        })

        this.loadPosts(value);
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
                    {page.page_results > 0 ?
                        <td className="align-middle text-center"><IconContext.Provider
                            value={{color: 'red', textAlign: "center"}}>
                            <AiOutlineWarning/>
                        </IconContext.Provider>
                            {page.page_results === 2 ? 0 : page.page_results}
                        </td>
                        : <td className="align-middle text-center">
                            <IconContext.Provider value={{color: 'green', textAlign: "center"}}>
                                <MdOutlineDone/>
                            </IconContext.Provider>
                            0</td>}


                    <td className="align-middle text-center"><a href={page.url} target="_blank"
                                                                rel="noopener noreferrer"><AiOutlineLink/></a></td>
                    <td className="align-middle text-center">
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
                                <Breadcrumb>
                                    <Breadcrumb.Item onClick={this.props.history.goBack}>Clients</Breadcrumb.Item>
                                    <Breadcrumb.Item active>Website details</Breadcrumb.Item>
                                </Breadcrumb>

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
                                <div className="d-inline-block ml-5">
                                    <Pagination>
                                        <Pagination.First disabled={this.state.pageNumber === 1} value={1}
                                                          onClick={() => this.toPage(1)}/>
                                        <Pagination.Prev disabled={this.state.pageNumber === 1}
                                                         value={this.state.pageNumber - 1}
                                                         onClick={() => this.toPage(this.state.pageNumber - 1)}/>
                                        <Pagination.Item value={this.state.pageNumber}
                                                         onClick={() => this.toPage(this.state.pageNumber)}>{this.state.pageNumber}</Pagination.Item>
                                        <Pagination.Item value={this.state.pageNumber + 1}
                                                         onClick={() => this.toPage(this.state.pageNumber + 1)}>{this.state.pageNumber + 1}</Pagination.Item>
                                        <Pagination.Item value={this.state.pageNumber + 2}
                                                         onClick={() => this.toPage(this.state.pageNumber + 2)}>{this.state.pageNumber + 2}</Pagination.Item>
                                        <Pagination.Item value={this.state.pageNumber + 3}
                                                         onClick={() => this.toPage(this.state.pageNumber + 3)}>{this.state.pageNumber + 3}</Pagination.Item>
                                        <Pagination.Item value={this.state.pageNumber + 4}
                                                         onClick={() => this.toPage(this.state.pageNumber + 4)}>{this.state.pageNumber + 4}</Pagination.Item>

                                        <Pagination.Ellipsis/>
                                        <Pagination.Item value={this.state.maxLength}
                                                         onClick={() => this.toPage(Math.ceil((this.state.maxLength / 25)))}> {Math.ceil((this.state.maxLength / 25))}</Pagination.Item>
                                        <Pagination.Next
                                            disabled={this.state.pageNumber === Math.ceil((this.state.maxLength / 25))}
                                            value={this.state.pageNumber + 1}
                                            onClick={() => this.toPage(this.state.pageNumber + 1)}/>
                                        <Pagination.Last
                                            disabled={this.state.pageNumber === Math.ceil((this.state.maxLength / 25))}
                                            value={this.state.maxLength}
                                            onClick={() => this.toPage(Math.ceil((this.state.maxLength / 25)))}/>
                                    </Pagination>
                                </div>
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
                                                <th>Problems</th>
                                                <th>URL</th>
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
        )
            ;
    }
}

export default WebsiteDetail;

