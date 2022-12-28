import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { deleteWebsite, updateWebsite } from "./WebsiteActions";
import { Button, Nav} from "react-bootstrap";

class WebsiteDetail extends Component {
  onDeleteClick = () => {
    const { website } = this.props;
    this.props.deleteWebsite(website.id);
  };
  onUpperCaseClick = () => {
    const { website } = this.props;
    this.props.updateWebsite(website.id, {
      content: website.content.toUpperCase()
    });
  };
  onLowerCaseClick = () => {
    const { website } = this.props;
    this.props.updateWebsite(website.id, {
      content: website.content.toLowerCase()
    });
  };
  render() {
    const { website } = this.props;
    return (
      <Nav.Item>
          <Nav.Link href={"/website/" + website.id + "/"}>{website.name}</Nav.Link>
      </Nav.Item>
    );
  }
}

Website.propTypes = {
  website: PropTypes.object.isRequired
};
const mapStateToProps = state => ({});

export default connect(mapStateToProps, { deleteWebsite, updateWebsite })(
  withRouter(Website)
);
