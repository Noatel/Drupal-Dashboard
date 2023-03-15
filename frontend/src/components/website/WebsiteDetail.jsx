import React, {Component} from "react";
import {Link} from "react-router-dom";
import Table from "react-bootstrap/Table";
import {Button, Spinner, Pagination} from "react-bootstrap";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {
    AiOutlineArrowDown,
    AiOutlineArrowUp,
    AiOutlineLink,
    AiOutlineWarning,
    AiFillEye
} from "react-icons/ai";
import {GrCheckmark} from "react-icons/gr";
import {IconContext} from "react-icons";
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
            order: false,
            allTest: 0,
            knownIssues: 0,
        }

        this.toPage = this.toPage.bind(this);
        this.orderPages = this.orderPages.bind(this);
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

        axios.get(`/websites/?test=true&website_id=${id}`).then(response => {
            this.setState({
                allTest: response.data,
            })
        }).catch(error => {
            toastOnError(error);
        });

        axios.get(`/websites/?known_issue=true&website_id=${id}`).then(response => {
            this.setState({
                knownIssues: response.data,
            })
        }).catch(error => {
            toastOnError(error);
        });
    }


    getAllTest(id) {

    }

    getKnownIssues(id) {

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
    orderPages = () => {
        const {id} = this.props.match.params;
        let order = !this.state.order;
        this.setState({
            order: order,
        })
        axios.get(`/pages/?website_id=${id}&order=` + order).then(response => {
            this.setState({
                maxLength: response.data.count,
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
            );
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
                    {page.page_results > 1 ?
                        <td className="align-middle text-center"><IconContext.Provider
                            value={{color: 'red', textAlign: "center"}}>
                            <AiOutlineWarning/>
                        </IconContext.Provider>
                            {page.page_results === 2 ? 0 : page.page_results}
                        </td>
                        : <td className="align-middle text-center">
                            <IconContext.Provider value={{color: 'green', textAlign: "center"}}>
                                <GrCheckmark/>
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
                <div className="row">
                    <div className="col-md-4 stretch-card grid-margin">
                        <div className="card bg-gradient-danger card-img-holder text-white">
                            <div className="card-body">
                                <img src={require("../../assets/images/circle.svg")} className="card-img-absolute"
                                     alt="circle"/>
                                <h4 className="font-weight-normal mb-3">Tested executed <i
                                    className="mdi mdi-chart-line mdi-24px float-right"></i>
                                </h4>
                                <h2 className="mb-5">{this.state.allTest}</h2>
                                {/*<h6 className="card-text">Increased by 60%</h6>*/}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 stretch-card grid-margin">
                        <div className="card bg-gradient-info card-img-holder text-white">
                            <div className="card-body">
                                <img src={require("../../assets/images/circle.svg")} className="card-img-absolute"
                                     alt="circle"/>
                                <h4 className="font-weight-normal mb-3">Known issues<i
                                    className="mdi mdi-bookmark-outline mdi-24px float-right"></i>
                                </h4>
                                <h2 className="mb-5">{this.state.knownIssues}</h2>
                                {/*<h6 className="card-text">Decreased by 10%</h6>*/}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 stretch-card grid-margin">
                        <div className="card bg-gradient-success card-img-holder text-white">
                            <div className="card-body">
                                <img src={require("../../assets/images/circle.svg")} className="card-img-absolute"
                                     alt="circle"/>
                                <h4 className="font-weight-normal mb-3">Different test executed<i
                                    className="mdi mdi-diamond mdi-24px float-right"></i>
                                </h4>
                                <h2 className="mb-5">95,5741</h2>
                                {/*<h6 className="card-text">Increased by 5%</h6>*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {/*<nav aria-label="breadcrumb">*/}
                    {/*               <ol className="breadcrumb">*/}
                    {/*                   <li className="breadcrumb-item"><a href="!#"*/}
                    {/*                                                      onClick={this.props.history.goBack}>Clients</a>*/}
                    {/*                   </li>*/}
                    {/*                   <li className="breadcrumb-item active" aria-current="page">Website details</li>*/}
                    {/*               </ol>*/}
                    {/*           </nav>*/}
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className={" card-title"}> {this.state.website.name} - Details</h4>
                                <p>{this.state.website.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className={" card-title"}> {this.state.website.name} - Changes</h4>
                                <Table className={"table"}>
                                    <thead className=" thead-page">
                                    <tr>
                                        <th>Page</th>
                                        <th>Block</th>
                                        <th>URL</th>
                                        <th>See changes</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr key={1}>
                                        <td>
                                            typify.com/contact
                                        </td>
                                        <td className="align-middle text-center">
                                            contact
                                        </td>
                                        <td className="align-middle text-center">
                                            <AiOutlineLink/>
                                        </td>
                                        <td className="align-middle text-center">
                                            <AiFillEye/>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Pages</h4>

                                <div className="display-card">

                                    <div className="d-inline-block">
                                        <Pagination>
                                            <Pagination.First disabled={this.state.pageNumber === 1} value={1}
                                                              onClick={() => this.toPage(1)}/>
                                            <Pagination.Prev disabled={this.state.pageNumber === 1}
                                                             value={this.state.pageNumber - 1}
                                                             onClick={() => this.toPage(this.state.pageNumber - 1)}/>
                                            <Pagination.Item value={this.state.pageNumber}
                                                             onClick={() => this.toPage(this.state.pageNumber)}>{this.state.pageNumber}</Pagination.Item>

                                            {(this.state.pageNumber + 1) > Math.ceil((this.state.maxLength / 25)) ?
                                                <Pagination.Item value={this.state.pageNumber + 1}
                                                                 disabled>{this.state.pageNumber + 1}</Pagination.Item> :
                                                <Pagination.Item value={this.state.pageNumber + 1}
                                                                 onClick={() => this.toPage(this.state.pageNumber + 1)}>{this.state.pageNumber + 1}</Pagination.Item>}
                                            {(this.state.pageNumber + 2) > Math.ceil((this.state.maxLength / 25)) ?
                                                <Pagination.Item value={this.state.pageNumber + 2}
                                                                 disabled>{this.state.pageNumber + 2}</Pagination.Item> :
                                                <Pagination.Item value={this.state.pageNumber + 2}
                                                                 onClick={() => this.toPage(this.state.pageNumber + 2)}>{this.state.pageNumber + 2}</Pagination.Item>}
                                            {(this.state.pageNumber + 3) > Math.ceil((this.state.maxLength / 25)) ?
                                                <Pagination.Item value={this.state.pageNumber + 3}
                                                                 disabled>{this.state.pageNumber + 3}</Pagination.Item> :
                                                <Pagination.Item value={this.state.pageNumber + 3}
                                                                 onClick={() => this.toPage(this.state.pageNumber + 3)}>{this.state.pageNumber + 3}</Pagination.Item>}
                                            {(this.state.pageNumber + 4) > Math.ceil((this.state.maxLength / 25)) ?
                                                <Pagination.Item value={this.state.pageNumber + 4}
                                                                 disabled>{this.state.pageNumber + 4}</Pagination.Item> :
                                                <Pagination.Item value={this.state.pageNumber + 4}
                                                                 onClick={() => this.toPage(this.state.pageNumber + 4)}>{this.state.pageNumber + 4}</Pagination.Item>}

                                            {5 > Math.ceil((this.state.maxLength / 25)) ? "" :
                                                <Pagination.Ellipsis/>}
                                            {/*<Pagination.Item value={this.state.maxLength}*/}
                                            {/*                 onClick={() => this.toPage(Math.ceil((this.state.maxLength / 25)))}> {Math.ceil((this.state.maxLength / 25))}</Pagination.Item>*/}
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
                                    <Table striped bordered hover>
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            {this.state.order ?
                                                <th>Problems <AiOutlineArrowDown onClick={this.orderPages}/></th> :
                                                <th>Problems <AiOutlineArrowUp onClick={this.orderPages}/></th>}
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
                            <div className="col-md-4 mt-5">
                                <img className="logo" src={this.state.website.image} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
            ;
    }
}

export default WebsiteDetail;