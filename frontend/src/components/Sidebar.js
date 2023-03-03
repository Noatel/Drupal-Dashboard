import React, {Component} from "react";
import {Menu, MenuItem, Sidebar} from "react-pro-sidebar";
import {Link} from "react-router-dom";
import {FiLogOut, IoPeopleCircleSharp, TiEquals} from "react-icons/all";
import {IconContext} from "react-icons";


class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (<div className={"sidebar"}>
                <Sidebar style={{height: "90vh"}} backgroundColor={"white"}>
                    <Menu iconShape="square">
                        <MenuItem className={"sidebar-item"}>
                            <h2 className={"sidebar-header"}> Typify
                                <IconContext.Provider value={{color: '#2daae1', textAlign: "center"}}>
                                    <TiEquals/>
                                </IconContext.Provider>
                            </h2>
                        </MenuItem>
                        <MenuItem component={<Link to="/clients" key={1}/>} icon={<IoPeopleCircleSharp/>}
                                  className={"sidebar-item"}> Clients </MenuItem>
                    </Menu>
                </Sidebar>
                <Sidebar style={{height: "10vh"}} backgroundColor={"white"}>
                    <Menu iconShape="square">
                        <MenuItem icon={<FiLogOut/>}>Logout</MenuItem>
                    </Menu>
                </Sidebar>
            </div>);
    }
}


export default SideBar;
