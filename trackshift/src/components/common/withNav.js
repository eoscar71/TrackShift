import React from 'react';
import NavBar from '../navBar';
import { Outlet } from 'react-router';

const WithNav = ({user}) => {
    return ( 
        <React.Fragment>
            <NavBar user={user}/>
            <Outlet/>
        </React.Fragment>
     );
}
 
export default WithNav;