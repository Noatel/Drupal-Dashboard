import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {getWebsites} from "./WebsiteActions";

import Website from "./Website";

class WebsiteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            website: {}
        };
    }

    componentDidMount() {
        this.props.getWebsites();
    }

    onWebsiteClick = () => {
        const website = this.website.value;
        this.props.onWebsiteClick(website);
    }

    render() {
        const {websites} = this.props.websites;

        if (websites.length === 0) {
            return (
                <div className="mt-5">
                    <h2>No websites</h2>
                    <hr/>
                </div>
            );
        }

        let items = websites.map(website => {
            return <Website key={website.id} website={website}  onSelectPages={this.handlePages}/>;
        });

        return (
            <div className="mt-5">
                <h2 className="sidebar-heading pl-3">Websites</h2>
                {items}
                <hr/>
            </div>
        );
    }
}

WebsiteList.propTypes = {
    getWebsites: PropTypes.func.isRequired,
    websites: PropTypes.any,
    website: PropTypes.object,
};

const mapStateToProps = state => ({
    websites: state.websites,
    website: state.website,
});

export default connect(mapStateToProps, {
    getWebsites
})(withRouter(WebsiteList));
