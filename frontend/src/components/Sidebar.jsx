import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Trans} from 'react-i18next'
import {FaUserAstronaut} from "react-icons/fa";
import {BsFillPersonFill} from "react-icons/bs";
import {FcSettings} from "react-icons/fc";
import {CgScreen} from "react-icons/cg";
import {IconContext} from "react-icons";

class Sidebar extends Component {
    state = {};

    render() {
        return (
            <nav className="sidebar sidebar-offcanvas" id="sidebar">
                <ul className="nav">
                    <li className="nav-item nav-profile">
                        <a href="!#" className="nav-link" onClick={evt => evt.preventDefault()}>
                            <div className="nav-profile-image">
                                <FaUserAstronaut size={44}/>
                                <span className="login-status online"></span>
                            </div>
                            <div className="nav-profile-text">
                                <span className="font-weight-bold mb-2"><Trans>Noah Telussa</Trans></span>
                                <span className="text-secondary text-small"><Trans>Back-end Developer</Trans></span>
                            </div>
                            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
                        </a>
                    </li>
                    <li className={'nav-item'}>
                        <Link to="/dashboard" key={1}/>
                        <Link className="nav-link" to="/dashboard">
                            <span className="menu-title"><Trans>Dashboard</Trans></span>
                            <IconContext.Provider value={{className: 'menu-icon'}}>
                                <CgScreen/>
                            </IconContext.Provider>
                        </Link>
                    </li>
                    <li className={'nav-item'}>
                        <Link className="nav-link" to="/clients">
                            <span className="menu-title"><Trans>Clients</Trans></span>
                            <IconContext.Provider value={{className: 'menu-icon'}}>
                                <BsFillPersonFill/>
                            </IconContext.Provider>
                        </Link>
                    </li>
                    <li className={'nav-item'}>
                        <Link className="nav-link" to="/settings">
                            <span className="menu-title"><Trans>Settings</Trans></span>
                            <IconContext.Provider value={{className: 'menu-icon'}}>
                                <FcSettings/>
                            </IconContext.Provider>
                        </Link>
                    </li>


                </ul>
            </nav>
        );
    }

}

export default Sidebar;