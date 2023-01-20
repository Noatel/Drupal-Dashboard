import React, {Component} from "react";
import {Nav} from "react-bootstrap";
import WebsiteList from "./website/WebsiteList";


class SideBar extends Component {
    render() {
        return (
            <Nav
                className="col-md-2 d-none d-md-block bg-light sidebar pl-4"
                activeKey="/home"
                onSelect={selectedKey => alert(`selected ${selectedKey}`)}>
                <WebsiteList/>
            </Nav>
        );
    }
}


export default SideBar;
