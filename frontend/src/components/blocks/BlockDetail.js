import React, {Component} from "react";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {Breadcrumb, ListGroup, Spinner} from "react-bootstrap";
import ReactDiffViewer from 'react-diff-viewer';
import {withRouter} from "react-router-dom";


class BlockDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isActive: false, compareData: null, changedContent: false
        };

        this.goBack = this.goBack.bind(this);
        this.goBackTwoPages = this.goBackTwoPages.bind(this);
        this.changeCompareData = this.changeCompareData.bind(this);
        this.getStatus = this.getStatus.bind(this);
    }

    goBack() {
        this.props.history.goBack();
    }

    goBackTwoPages() {
        this.props.history.go(-2);
    }

    componentDidMount() {
        const {id} = this.props.match.params;

        axios.get(`/blocks/${id}/`).then(block => {
            this.setState({
                block: block.data, isActive: true,
            })
            console.warn(this.state.block);
        }).catch(error => {
            toastOnError(error);
        });
    }

    changeCompareData(result) {
        this.setState({
            changedContent: result
        })
        console.warn(result)
    }

    getStatus(status) {
        if (status === "1") {
            return 'Nothing changed'
        } else if (status === "2") {
            return 'Something changed'
        }
        return 'Block deleted'
    }

    render() {
        if (!this.state.isActive) {
            return (<div className="spinner-div">
                <Spinner animation="border" role="status" className="spinner">
                </Spinner>
            </div>)
        }

        let status = null;
        let results = null;

        if (this.state.block.results.length > 0) {
            results = this.state.block.results.map((result, i) => {
                    if (this.state.changedContent === false && i === (this.state.block.results.length - 1)) {
                        return (<ListGroup.Item as="li" active key={result.id} onClick={(event) => {
                            event.preventDefault();
                            this.changeCompareData(result)
                        }}>
                            {result.created_at}
                        </ListGroup.Item>);
                    } else if (!this.state.changedContent) {
                        return (<ListGroup.Item as="li" key={result.id} onClick={(event) => {
                            event.preventDefault();
                            this.changeCompareData(result)
                        }}>
                            {result.created_at}
                        </ListGroup.Item>);
                    }

                    if (this.state.changedContent) {
                        if (this.state.changedContent.id === result.id) {
                            return (<ListGroup.Item as="li" active key={result.id} onClick={(event) => {
                                event.preventDefault();
                                this.changeCompareData(result)
                            }}>
                                {result.created_at}
                            </ListGroup.Item>);
                        } else {
                            return (<ListGroup.Item as="li" key={result.id} onClick={(event) => {
                                event.preventDefault();
                                this.changeCompareData(result)
                            }}>
                                {result.created_at}
                            </ListGroup.Item>);
                        }
                    } else {
                        return ('');
                    }
                }
            );
        }

        let newValue;
        if (this.state.block.results.length > 0) {
            status = this.getStatus(this.state.block.results[this.state.block.results.length - 1].status)
            newValue = this.state.changedContent ? this.state.changedContent : this.state.block.results[this.state.block.results.length - 1]
        } else {
            status = this.getStatus(this.state.block.results[0].status)
            newValue = this.state.changedContent ? this.state.changedContent : this.state.block.results[0]
        }


        if (this.state.changedContent) {
            status = this.getStatus(this.state.changedContent.status)
            newValue = this.state.changedContent
        }
        console.warn(status)
        return (<div className="container">
            <div className="row">
                <div className="col-md-2">
                </div>
                <div className="col-md-6 mt-5">
                    <Breadcrumb>
                        <Breadcrumb.Item href="/clients">Clients</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={this.goBackTwoPages}>Website details</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={this.goBack}>Page details</Breadcrumb.Item>
                        <Breadcrumb.Item active>Block details</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2">
                </div>
                <div className="col-md-4 mt-5">
                    <div>
                        <h2>History</h2>
                        <ListGroup as="ul">
                            {results}
                        </ListGroup>

                    </div>

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
                <div className="col-md-10 mt-5">
                    <ReactDiffViewer oldValue={this.state.block.content[0].content}
                                     newValue={status === 'Nothing changed' ? this.state.block.content[0].content : newValue.data.content}
                                     splitView={true}
                                     compareMethod={'diffWords'}
                                     showDiffOnly={true}
                                     useDarkTheme={false}
                                     leftTitle={"Saved data"}
                                     rightTitle={"Live data"}
                    />
                </div>
            </div>
        </div>);
    }
}


export default withRouter(BlockDetail);

