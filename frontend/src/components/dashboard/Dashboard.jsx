import React, {Component} from "react";
import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";
import {PieChart, Pie, ResponsiveContainer, Cell} from "recharts";
import axios from "axios";
import {toastOnError} from "../../utils/Utils";
import {Link} from "react-router-dom";
import {AiFillSetting} from "react-icons/ai";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            website: {},
            websites: [],
            edits: [],
            problems: [],
            isProblemsActive: false,
            isEditActive: false,
            isAllProblemsActive: false,
            allProblems: "",
            allTest: 0,
            knownIssues: 0,
        }

        this.getProblems = this.getProblems.bind(this);
        this.getEdits = this.getEdits.bind(this);
    }

    componentDidMount() {
        this.getProblems()
        this.getEdits()
        this.getAllProblems()
        this.getAllTest()
        this.getKnownIssues()
    }

    handlePages = (pageObject) => {
        this.setState({pages: pageObject});
    }


    getProblems() {
        axios.get(`/websites/?problems=true`).then(response => {
            this.setState({
                problems: response.data,
                isProblemsActive: true,
            })
        }).catch(error => {
            toastOnError(error);
        });
    }

    getEdits() {
        axios.get(`/websites/?edit=true`).then(response => {
            this.setState({
                edits: response.data,
                isEditActive: true,
            })
        }).catch(error => {
            toastOnError(error);
        });
    }

    getAllProblems() {
        axios.get(`/websites/?all_problems=true`).then(response => {
            this.setState({
                allProblems: response.data,
                isAllProblemsActive: true,
            })
        }).catch(error => {
            toastOnError(error);
        });
    }

    getAllTest() {
        axios.get(`/websites/?all_test=true`).then(response => {
            this.setState({
                allTest: response.data,
            })
        }).catch(error => {
            toastOnError(error);
        });
    }
  getKnownIssues() {
        axios.get(`/websites/?all_known_issues=true`).then(response => {
            this.setState({
                knownIssues: response.data,
            })
        }).catch(error => {
            toastOnError(error);
        });
    }

    render() {
        let data = [
            {
                "name": "alt",
                "value": 0
            },
            {
                "name": "order",
                "value": 0
            },
            {
                "name": "h1",
                "value": 0
            }
        ];
        let percentages = [];
        if (this.state.isAllProblemsActive) {
            data = this.state.allProblems;
            let total = 0;
            data.forEach(obj => {
                total += obj.value;
            });
            data.forEach(obj => {
                const percentage = (obj.value / total) * 100;
                percentages.push({name: obj.name, value: Math.round(percentage)});
            });
        }

        const COLORS = ['#0088FE', '#00C49F', '#fe7c96'];

        return (
            <div className="mt-5">
                <div className="row">
                    <div className="col-md-4 stretch-card grid-margin">
                        <div className="card bg-gradient-danger card-img-holder text-white">
                            <div className="card-body">
                                <img src={require("../../assets/images/circle.svg")} className="card-img-absolute"
                                     alt="circle"/>
                                <h4 className="font-weight-normal mb-3">Tested executed <i
                                    className="mdi mdi-chart-line mdi-24px float-right"></i>
                                </h4>
                                <h2 className="mb-5">{this.state.allTest}</h2>
                                {/*<h6 className="card-text">Increased by 60%</h6>*/}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 stretch-card grid-margin">
                        <div className="card bg-gradient-info card-img-holder text-white">
                            <div className="card-body">
                                <img src={require("../../assets/images/circle.svg")} className="card-img-absolute"
                                     alt="circle"/>
                                <h4 className="font-weight-normal mb-3">Known issues<i
                                    className="mdi mdi-bookmark-outline mdi-24px float-right"></i>
                                </h4>
                                <h2 className="mb-5">{this.state.knownIssues}</h2>
                                {/*<h6 className="card-text">Decreased by 10%</h6>*/}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 stretch-card grid-margin">
                        <div className="card bg-gradient-success card-img-holder text-white">
                            <div className="card-body">
                                <img src={require("../../assets/images/circle.svg")} className="card-img-absolute"
                                     alt="circle"/>
                                <h4 className="font-weight-normal mb-3">Different test executed<i
                                    className="mdi mdi-diamond mdi-24px float-right"></i>
                                </h4>
                                <h2 className="mb-5">95,5741</h2>
                                {/*<h6 className="card-text">Increased by 5%</h6>*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-7 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className={"card-title"}>Recent problems:</h4>
                                <Table className={"table"}>
                                    <thead className=" thead-page">
                                    <tr>
                                        <th>Website</th>
                                        <th>Page</th>
                                        <th>Problems</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.problems &&
                                        this.state.problems.map((problem) => (
                                            <>
                                                <tr key={problem.id}>
                                                    <td rowSpan={problem.pages.length + 1}>
                                                        <Link to={"/website/" + problem.id}>
                                                            {problem.name}
                                                        </Link>
                                                    </td>
                                                </tr>
                                                {problem.pages.map((page) => (
                                                    <tr key={page.id}>
                                                        <td>
                                                            <Link to={"/page/" + page.id}>
                                                                {page.name ? page.name : 'homepage'}
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <Link to={"/page/" + page.id}>
                                                                {page.page_results}
                                                            </Link>
                                                        </td>

                                                    </tr>
                                                ))}
                                            </>
                                        ))}
                                    </tbody>
                                </Table>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Most category problems</h4>
                                {data[0] !== '' ?
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart width={200} height={200}>
                                            <Pie
                                                data={data}
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                cx="50%"
                                                cy="50%"
                                            >
                                                {data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`}
                                                          fill={COLORS[index % COLORS.length]}/>
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    : ""}
                                <div id=" traffic-chart-legend"
                                     className=" rounded-legend legend-vertical legend-bottom-left pt-4">
                                    <ul className="legend">
                                        <li key="1">
                                            <span className=" legend-dots bg-info"></span>Missing alt text
                                            <span
                                                className=" float-right">{percentages[0] ? percentages[0].value : 0}%</span>
                                        </li>
                                        <li key="2">
                                            <span className=" legend-dots bg-success"></span>Duplicated headers
                                            <span
                                                className=" float-right">{percentages[1] ? percentages[1].value : 0}%</span>
                                        </li>
                                        <li key="3">
                                            <span className=" legend-dots bg-danger"></span> Headers not
                                            alphanumberic
                                            <span
                                                className=" float-right">{percentages[2] ? percentages[2].value : 0}%</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className={" card-title"}>Recent edits:</h4>
                                <Table className={"table"}>
                                    <thead className=" thead-page">
                                    <tr>
                                        <th>Page</th>
                                        <th>Block</th>
                                        <th>Date edited</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.edits &&
                                        this.state.edits.map((edit) => (
                                            <>

                                                {edit.pages.map((page) => (
                                                    <>
                                                        <tr key={page.id}>
                                                            <td rowSpan={page.blocks.length + 1}>
                                                                <Link to={"/page/" + page.id}>
                                                                    {edit.name} - {page.name ? page.name : 'homepage'}
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                        {page.blocks.map((block) => (
                                                            <tr key={block.id}>
                                                                <td>
                                                                    <Link to={"/block/" + block.id  + "/results"}>
                                                                        {block.name ? block.name : 'homepage'}
                                                                    </Link>
                                                                </td>
                                                                <td>
                                                                    <Link to={"/block/" + block.id + "/results"}>
                                                                        {block.results[block.results.length -1].created_at}
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                ))}
                                            </>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard
    .propTypes = {
    pages: PropTypes.object,
    website: PropTypes.object,
    websites: PropTypes.any,
};

export default Dashboard;
