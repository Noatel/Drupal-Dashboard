import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

import {Container} from "react-bootstrap";
import {logout} from "../login/LoginActions";
import Sidebar from "../Sidebar";
import PageList from "../pages/PageList";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            website: {},
            websites: []
        }
    }

    handlePages = (pageObject) => {
        this.setState({pages: pageObject});
    }

    render() {
        const {pages} = this.props.pages;
        const {websites} = this.props.websites;

        return (
            <div>
                <Sidebar pages={pages}/>

                <Container>
                    {/*<AddWebsite/>*/}
                    <PageList pages={pages} websites={websites}/>
                </Container>
            </div>
        );
    }
}

Dashboard.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    pages: PropTypes.object,
    website: PropTypes.object,
    websites: PropTypes.any,
};

const mapStateToProps = state => ({
    auth: state.auth,
    pages: state.pages,
    websites: state.websites,
    website: state.website,
});

export default connect(mapStateToProps, {
    logout
})(withRouter(Dashboard));
