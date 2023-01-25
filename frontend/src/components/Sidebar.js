import React, {Component} from "react";
import {Nav} from "react-bootstrap";
import {Link} from "react-router-dom";


class SideBar extends Component {
    render() {
        return (
            <Nav
                className="col-md-2 d-none d-md-block bg-light sidebar pl-4"
                activeKey="/home"
                onSelect={selectedKey => alert(`selected ${selectedKey}`)}>
                <img src="/logo.png" alt="Typify"/>
                {/*<WebsiteList/>*/}

                <div className="mt-5">
                    <Link to={"/clients"} key={1}>
                        Clients
                    </Link>
                </div>
            </Nav>
        );
    }
}


export default SideBar;
