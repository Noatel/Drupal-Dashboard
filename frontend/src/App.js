import React, {Component} from "react";
import {Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Home from "./components/Home";
import Signup from "./components/account/Signup";
import Login from "./components/login/Login";
import ResendActivation from "./components/account/ResendActivation";
import ActivateAccount from "./components/account/ActivateAccount";
import ResetPassword from "./components/account/ResetPassword";
import ResetPasswordConfirm from "./components/account/ResetPasswordConfirm";
import Dashboard from "./components/dashboard/Dashboard";
import axios from "axios";
import PageDetail from "./components/pages/PageDetail";
import SideBar from "./components/Sidebar";
import Page from "./components/pages/Page";
import WebsiteDetail from "./components/website/WebsiteDetail";
import Root from "./Root";
import BlockDetail from "./components/blocks/BlockDetail";
import ClientsList from "./components/clients/ClientList";
import ChecklistDetail from "./components/checklist/ChecklistDetail";
import SettingsList from "./components/settings/SettingsList";
import Navbar from "./components/Navbar";


export const baseURL = process.env.REACT_APP_API_URL;
axios.defaults.baseURL = baseURL;


class App extends Component {
    render() {
        return (
            <div id="app">
                <Root>

                    <div className="container-scroller">
                        <Navbar/>
                        <div className="container-fluid page-body-wrapper">
                            <SideBar/>
                            <div className="main-panel">
                                <div className="content-wrapper">
                                    <ToastContainer hideProgressBar={true} newestOnTop={true}/>
                                    <Route path="/signup" component={Signup}/>
                                    <Route path="/login" component={Login}/>
                                    <Route path="/dashboard" component={Dashboard}/>
                                    <Route path="/" component={Home}/>

                                    <Route path="/resend_activation" component={ResendActivation}/>
                                    <Route path="/activate/:uid/:token" component={ActivateAccount}/>
                                    <Route path="/send_reset_password/" component={ResetPassword}/>
                                    <Route path="/reset_password/:uid/:token" component={ResetPasswordConfirm}/>

                                    <Route path="/website/:id" component={WebsiteDetail}/>
                                    <Route path="/page/:id" component={Page}/>

                                    <Route path="/page/:id/detail" component={PageDetail}/>
                                    <Route path="/page/:id/detail" component={PageDetail}/>
                                    <Route path="/page/:uid/detail" component={PageDetail}/>


                                    <Route path="/block/:id/results" component={BlockDetail}/>

                                    <Route exact path="/clients" component={ClientsList}/>
                                    <Route exact path="/clients/website/:id" component={ChecklistDetail}/>

                                    <Route exact path="/settings" component={SettingsList}/>
                                    {/*{ SettingsPanelComponent }*/}
                                </div>
                                {/*{ footerComponent }*/}
                            </div>
                        </div>
                    </div>
                </Root>
            </div>
        );
    }
}

export default App;
