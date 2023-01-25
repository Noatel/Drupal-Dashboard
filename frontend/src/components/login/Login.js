import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Button, Form} from "react-bootstrap";

import {login} from "./LoginActions.js";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    onLoginClick = () => {
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.login(userData, "/dashboard");
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-4 loginCol">
                        <h1>Login</h1>
                        <Form>
                            <Form.Group controlId="emailId">
                                <Form.Label>Your Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    placeholder="Enter email"
                                    value={this.state.email}
                                    onChange={this.onChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="passwordId">
                                <Form.Label>Your password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                />
                            </Form.Group>
                        </Form>
                        <Button color="primary" onClick={this.onLoginClick}>
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

//export default Login;
Login.propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {
    login
})(withRouter(Login));
