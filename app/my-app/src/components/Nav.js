import React from 'react';
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';

/**
 * Nav Component
 * @param {*} props 
 * @returns 
 */
function Nav(props) {

    const wrapperFunction = () => {
      //executest the logout function passed by props
      props.passedLogout();
      // redirects the client to the login page
      props.history.push("/");
    }

    return (
        <nav>
            <div id="navLeft"><h2 id="sideText">Covid Application Rhys Halpin w15020067</h2></div>
            <div id="navRight"><h2 id="sideText">{props.loggedIn === true ? <Button onClick={wrapperFunction}
                variant="contained" color="secondary">
                Logout
            </Button> : null}</h2></div>




        </nav>


    );
}

// wrapped Nav component in withRouter to give access to browser history for redirects
export default withRouter(Nav);