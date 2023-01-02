import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {AiFillEye, AiOutlineLink, BsFillPencilFill} from "react-icons/all";

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
                    <tr>
                      <td><p style={{textTransform: 'capitalize'}}>{page.name.split('-').join(' ') }  </p></td>
                      <td><a href={page.url} target="_blank" rel="noopener noreferrer"><AiOutlineLink/></a></td>
                      <td><a href={page.url + "/edit"}><BsFillPencilFill/></a></td>
                      <td><a href={page.url + "/view"}><AiFillEye/></a></td>
                    </tr>

        );
    }
}

Page.propTypes = {
    pages: PropTypes.object,
};

const mapStateToProps = state => ({
    pages: state.pages,
});

export default connect(mapStateToProps, {})(withRouter(Page));
