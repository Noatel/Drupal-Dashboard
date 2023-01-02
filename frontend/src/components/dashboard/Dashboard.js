import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

import {Container, Navbar, Nav} from "react-bootstrap";
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
        console.warn('pageObject')
        console.warn(pageObject)
        this.setState({pages: pageObject});
    }

    onLogout = () => {
        this.props.logout();
    };

    render() {
        const {user} = this.props.auth;
        const {pages} = this.props.pages;
        const {websites} = this.props.websites;

        return (
            <div>
                <Navbar bg="light">
                    <Navbar.Brand href="/">Typify Dashboard</Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            User: <b>{user.username}</b>
                        </Navbar.Text>
                        <Nav.Link onClick={this.onLogout}>Logout</Nav.Link>
                    </Navbar.Collapse>
                </Navbar>

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
