import React, {Component, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Page from "./Page";
import Table from "react-bootstrap/Table";
import {Button} from "react-bootstrap";
import {scheduleWebsite} from "../website/WebsiteActions";


class PageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: {},
            website: {},
            websites: [],
        }
    }

    onWebsiteClick = () => {
        const website = this.website.value;
        this.props.onWebsiteClick(website);
    }


    handleClick = (event) => {
        const id = event.target.value
        this.props.scheduleWebsite(id, {

        });
        // setLoading(true);
    };

    render() {
        const {pages} = this.props.pages;
        let {website} = this.props.websites.website;

        if (typeof this.props.websites !== 'undefined') {
            if (Object.keys(this.props.websites.website).length > 0 && typeof this.props.websites.website == 'object') {
                website = this.props.websites.website;
            } else {
                website = {
                    description: "",
                    id: "",
                    image: "",
                    name: "",
                    url: ""
                }
            }
        }

        if (pages.length === 0) {
            return (
                <div className="row">
                    <div className="col-md-2">
                    </div>

                    <div className="col-md-10 mt-5">
                        <h2>Select a website in the sidebar</h2>
                    </div>
                </div>
            );
        }

        let items = pages.map(page => {
            return (
                <Page key={page.id} page={page}/>
            );
        });

        return (
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
        );
    }
}

PageList.propTypes = {
    pages: PropTypes.object,
    website: PropTypes.any,
    websites: PropTypes.any,
};

const mapStateToProps = state => ({
    websites: state.websites,
    website: state.website,
    pages: state.pages
});

export default connect(mapStateToProps, {
    scheduleWebsite
})(withRouter(PageList));
