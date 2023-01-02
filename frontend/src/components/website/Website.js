import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {deleteWebsite, setWebsite, updateWebsite} from "./WebsiteActions";
import {Nav} from "react-bootstrap";
import {getPagesByWebsiteId} from "../pages/PageActions";

class Website extends Component {
    constructor(props) {
        super(props);
        this.state = {
            website: {}
        };
    }

    loadPages(website) {
        this.props.getPagesByWebsiteId(website.id);
        this.props.setWebsite(website)
    }

    render() {
        const {website} = this.props

        return (
            <Nav.Item>
                <Nav.Link value={website.id} onClick={() => this.loadPages(website)}>
                    {website.name}
                </Nav.Link>
            </Nav.Item>
        );
    }
}

Website.propTypes = {
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {
    deleteWebsite,
    updateWebsite,
    getPagesByWebsiteId,
    setWebsite
})(withRouter(Website));
