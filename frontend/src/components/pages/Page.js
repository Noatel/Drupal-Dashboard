import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {AiFillEye, AiOutlineLink, BsFillPencilFill} from "react-icons/all";

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: {},
            load: false,
            modalShow: false,
        };

    }

    handlePageDetail = (page) => {
        this.props.onPageDetail(page);
    }

    handleShow = () => {
        this.setState({modalShow: false});
    }

    render() {
        const {page} = this.props;

        if (page.name === '') {
            page.name = "Name not found"
        }

        return (
            <tr>
                <td><p style={{textTransform: 'capitalize'}}>{page.name.split('-').join(' ')}  </p></td>
                <td><a href={page.url} target="_blank" rel="noopener noreferrer"><AiOutlineLink/></a></td>
                <td><a href={page.url + "/edit"}><BsFillPencilFill/></a></td>
                <td>
                    <a href="/" onClick={(event) => {
                        event.preventDefault();
                        this.handlePageDetail(page)
                    }}>
                        <AiFillEye/>
                    </a>
                </td>
            </tr>


        );
    }
}

Page.propTypes = {
    pages: PropTypes.object,
    onPageDetail: PropTypes.any,
    handlePageDetail: PropTypes.any,
};

const mapStateToProps = state => ({
    pages: state.pages,
});

export default connect(mapStateToProps, {})(withRouter(Page));
