import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { addWebsite } from "./WebsiteActions";

class AddWebsite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      website: {}
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onAddClick = () => {
    const website = {
      content: this.state.content
    };
    this.props.addWebsite(website);
  };

  render() {
    return (
      <div>
        <h2>Add new website</h2>
        <Form>
          <Form.Group controlId="contentId">
            <Form.Label>website</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="content"
              placeholder="Enter website"
              value={this.content}
              onChange={this.onChange}
            />
          </Form.Group>
        </Form>
        <Button variant="success" onClick={this.onAddClick}>
          Add website
        </Button>
      </div>
    );
  }
}

AddWebsite.propTypes = {
  addWebsite: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { AddWebsite })(withRouter(addWebsite));
