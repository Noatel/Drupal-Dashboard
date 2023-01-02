import React, {Component} from "react";
import {Nav} from "react-bootstrap";
import {withRouter} from "react-router";
import WebsiteList from "./website/WebsiteList";
import PropTypes from "prop-types";
import {connect} from "react-redux";


class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            websites: [],
            website: {}
        };
    }

    handleWebsite = (websiteObject) => {
        this.setState({websites: websiteObject});
    }


    render() {
        const {websites} = this.props.websites;

        return (
            <Nav
                className="col-md-2 d-none d-md-block bg-light sidebar"
                activeKey="/home"
                onSelect={selectedKey => alert(`selected ${selectedKey}`)}>
                <WebsiteList websites={websites}/>
            </Nav>
        );
    };
};

const mapStateToProps = state => ({
    websites: state.websites,
    website: state.website
});

WebsiteList.propTypes = {
    websites: PropTypes.any,
    website: PropTypes.object
};

export default connect(mapStateToProps, {
    SideBar
})(withRouter(SideBar));

