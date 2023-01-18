import React, {Component} from "react";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {Spinner} from "react-bootstrap";

class BlockDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        };
    }

    componentDidMount() {
        const {id} = this.props.match.params;

        axios.get(`/blocks/${id}/`).then(response => {
            this.setState({
                block: response.data,
                isActive: true
            })
        }).catch(error => {
            toastOnError(error);
        });
    }


    render() {

        if (!this.state.isActive) {
            return (
                <div className="spinner-div">
                    <Spinner animation="border" role="status" className="spinner">
                    </Spinner>
                </div>
            )
        }

        let status = null;

        if (this.state.block.results.length > 0) {
            // Change to the last one in the array
            if (this.state.block.results[0].status === '1') {
                status = 'Nothing changed'
            } else if (this.state.block.results[0].status === '2') {
                status = 'Something changed'
            } else if (this.state.block.results[0].status === '3') {
                status = 'Block deleted'
            }
            console.warn(this.state.block.results[0].data.content);
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-6 mt-5">
                        <h1>Block information</h1>
                        <p>
                            Some basic information about the current block <br/>
                            this includes the name, type of the block and the content inside it
                        </p>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input type="name" className="form-control" readOnly={true} id="name"
                                   value={this.state.block.name}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Type:</label>
                            <input type="type" className="form-control" readOnly={true} id="type"
                                   value={this.state.block.type}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Latest status:</label>
                            <input type="type" className="form-control" readOnly={true} id="status"
                                   value={status}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-4 mt-5">
                        <p>Original:</p>
                        <textarea className="form-control"
                                  rows="20">
                                                {this.state.block.content[0].content}
                                            </textarea>
                    </div>
                    <div className="col-md-4 mt-5">
                        <p>Live result:</p>
                        <textarea className="form-control"
                                  rows="20">
                            {/*Right now, only the first result of the test will show */}
                            {this.state.block.results.length > 0 ? this.state.block.results[0].data.content : ''}
                        </textarea>
                    </div>
                </div>
            </div>
        );
    }
}


export default BlockDetail;

