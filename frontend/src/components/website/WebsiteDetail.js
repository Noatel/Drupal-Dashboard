import React, {Component} from "react";
import {Link} from "react-router-dom";
import Table from "react-bootstrap/Table";
import {Breadcrumb, Button, Spinner} from "react-bootstrap";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {AiFillEye, AiOutlineLink, AiOutlineWarning, BsCircleFill, MdOutlineDone} from "react-icons/all";
import {IconContext} from "react-icons";

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
            let pageErrors = 0;

            if (Object.keys(page.page_results).length > 0) {
                page.page_results.forEach(result => {
                    if (result.attribute === 'meta') {
                        if (result.value[0].length === 0 || result.value[1].length === 0 || (result.value[0].length === 0 && result.value[1].length === 0)) {
                            pageErrors += 1;
                        }
                    } else {
                        pageErrors += 1;
                    }
                });
            }
            return (
                <tr key={page.id}>
                    <td><p
                        style={{textTransform: 'capitalize'}}>{page.name ? page.name.split('-').join(' ') : "None"}  </p>
                    </td>
                    {pageErrors > 0 ?
                        <td className="align-middle text-center"><IconContext.Provider value={{color: 'red', textAlign: "center"}}>
                            <AiOutlineWarning/>
                        </IconContext.Provider>
                            {pageErrors}
                        </td>
                        : <td className="align-middle text-center">
                            <IconContext.Provider value={{color: 'green', textAlign: "center"}}>
                                <MdOutlineDone/>
                            </IconContext.Provider>
                            0</td>}


                    <td className="align-middle text-center"><a href={page.url} target="_blank" rel="noopener noreferrer"><AiOutlineLink/></a></td>
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
        );
    }
}

export default WebsiteDetail;
