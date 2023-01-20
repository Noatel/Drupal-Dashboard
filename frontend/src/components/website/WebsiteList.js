import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";

class WebsiteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            websites: {}
        };
    }

    componentDidMount() {
        axios.get("/websites/").then(response => {
            this.setState({
                websites: response.data
            })
        }).catch(error => {
            toastOnError(error);
        });
    }


    render() {
        if (this.state.websites.length > 0) {
            let items = this.state.websites.map(website => {
                return (
                    <Link to={"/website/" + website.id} key={website.id}>
                        {website.name}
                    </Link>
                )
            });
            return (
                <div className="mt-5">
                    <h2 className="sidebar-heading">Websites</h2>
                    {items}
                </div>
            );
        }

        return (
            <div className="mt-5">
                <h2>No websites</h2>
                <hr/>
            </div>
        );
    }
}


export default WebsiteList;
