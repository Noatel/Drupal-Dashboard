import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {scheduleChecklist} from "../website/WebsiteActions";
import PropTypes from "prop-types";
import ResetPassword from "../account/ResetPassword";


class SettingsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            website: null,
            isActive: false
        };
    }

    componentDidMount() {

    }


    render() {
        const {user} = this.props.auth;
        return (
            <div>
                <div className="row">
                    <div className="col-md-6 stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Settings</h4>
                                <div className="card">
                                    <label htmlFor="type">Username:</label>
                                    <input type="type" className="form-control" readOnly={true} id="type"
                                           value={user.username}/>
                                    <label htmlFor="type">Email:</label>
                                    <input type="type" className="form-control" readOnly={true} id="type"
                                           value={user.email}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <ResetPassword/>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<Breadcrumb>*/
                }
                {/*    <Breadcrumb.Item href="/clients">Clients</Breadcrumb.Item>*/
                }
                {/*    <Breadcrumb.Item active>Settings</Breadcrumb.Item>*/
                }
                {/*</Breadcrumb>*/
                }

            </div>)
            ;
    }
}


SettingsList.propTypes = {
    website: PropTypes.any,
};

const mapStateToProps = state => ({
    website: state.website,
    auth: state.auth,
});

export default connect(mapStateToProps, {
    scheduleChecklist,
})(withRouter(SettingsList));

