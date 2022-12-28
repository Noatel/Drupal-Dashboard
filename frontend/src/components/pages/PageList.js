import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Page from "./Page";


class PageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: {},
            websites: {},
            website: {}
        };
    }

    onWebsiteClick = () => {
        const website = this.website.value;
        this.props.onWebsiteClick(website);
    }

    render() {
        const {pages} = this.props.pages;
        const {websites} = this.props.websites;

        console.warn(this.props)

        if (pages.length === 0) {
            return (
                <div className="row">
                    <div className="col-md-2">
                    </div>

                    <div className="col-md-10 mt-5">
                        <h2>Select a website in the sidebar</h2>
                    </div>
                </div>
            );
        }

        let items = pages.map(page => {
            return (
                <Page key={page.id} page={page}/>
            );
        });

        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <h1>adf</h1>
                    </div>
                    <div className="col-md-4">
                    </div>

                </div>

                <div className="row">
                    <div className="col-md-2">
                    </div>

                    <div className="col-md-10 mt-5">
                        <h2>Pages:</h2>
                        <div className="">
                            {items}
                        </div>
                        <hr/>
                    </div>
                </div>
            </div>
        )
            ;
    }
}

PageList.propTypes = {
    pages: PropTypes.object,
    websites: PropTypes.object,
};

const mapStateToProps = state => ({
    websites: state.website,
    pages: state.pages
});

export default connect(mapStateToProps, {})(withRouter(PageList));
