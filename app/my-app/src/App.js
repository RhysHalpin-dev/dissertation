import React, { useEffect, useState } from 'react';
import Login from './components/Login.js';

import Admin from './components/Admin.js';
import Nav from './components/Nav.js';
import Footer from './components/footer.js';
import NotFound404 from './components/NotFound404.js';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useHistory } from "react-router-dom";
import './App.css';


export default function App() {
  const [loggedIn, setLoggedIn] = useState()
  let history = useHistory()

  useEffect(() => {
    let loggedState = localStorage.getItem("login")
    loggedState = JSON.parse(loggedState)
    setLoggedIn(loggedState)
  },[])

  const logout = () => {
    console.log("TESTINGGGGG")
    localStorage.removeItem("authorization")
    localStorage.removeItem("login")
    setLoggedIn(false)
    //history.replace("/")

}



  return (

    <div className='app'>
      <div>
        Logged in?  {loggedIn === true? "true" : "false"}
        
        {/* Header */}
        {/* app body */}
        {/* sidebar */}
        <Router>
        <Nav {...{ loggedIn }} passedLogout={logout} history={history} />
          <Switch>

            <Route exact path="/" render={(props) => (<Login {...props} loggedIn={loggedIn} onLoginChange={setLoggedIn} />)} />
            <Route exact path="/nav" component={Nav} />
            <Route exact path="/admin" render={(props) => (<Admin {...props} loggedIn={loggedIn} onLoginChange={setLoggedIn} history={history} />)} />
            <Route path="*" component={NotFound404} />
          </Switch>
        </Router>
      </div>
      <Footer />
    </div>
  );


}


