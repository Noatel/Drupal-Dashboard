import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: {}
        };
    }

    render() {
        const {page} = this.props;

        if (page.name === '') {
            page.name = "Name not found"
        }
        return (
            <div className="row">
                <div className="col-md-6">
                    <p>{page.name} </p>
                </div>
                <div className="col-md-6">
                    <p> {page.url}</p>
                </div>
            </div>
        );
    }
}

Page.propTypes = {
    pages: PropTypes.object
};

const mapStateToProps = state => ({
    pages: state.pages
});

export default connect(mapStateToProps, {})(withRouter(Page));
