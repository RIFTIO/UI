/*
 * 
 *   Copyright 2016 RIFT.IO Inc
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import React from 'react';
import Utils from 'utils/utils.js';
import Button from 'widgets/button/rw.button.js';
import './login.scss'
let rw = require('utils/rw.js');
class LoginScreen extends React.Component{
  constructor(props) {
    super(props);
    var API_SERVER =  rw.getSearchParams(window.location).api_server;
    if (!API_SERVER) {
      window.location.href = "//" + window.location.host + '/index.html?api_server=' + window.location.protocol + '//localhost';
    }
    this.state = {
      username: '',
      password: ''
    };

  }
  updateValue = (e) => {
    let state = {};
    state[e.target.name] = e.target.value;
    this.setState(state);
  }
  validate = (e) => {
    let self = this;
    let state = this.state;
    e.preventDefault();
    if (state.username == '' || state.password == '') {
      console.log('false');
      return false;
    } else {
      Utils.setAuthentication(state.username, state.password, function() {
        //Returning to previous location disabled post port
        //  let hash = window.sessionStorage.getItem("locationRefHash") || '#/';
        //   if (hash == '#/login') {
        //     hash = '#/'
        //   }
        // window.location.hash = hash;
        self.context.router.push('/');
      });

    }
  }
  submitForm = (e) => {
      if(e.keyCode == 13){
        this.validate(e);
      }
  }
  render() {
    let html;
    html = (
      <form className="login-cntnr" autoComplete="on" onKeyUp={this.submitForm}>
        <div className="logo"> </div>
        <h1 className="riftio">Launchpad Login</h1>
        <p>
            <input type="text" placeholder="Username" name="username" value={this.state.username} onChange={this.updateValue} autoComplete="username"></input>
        </p>
        <p>
            <input type="password" placeholder="Password" name="password" onChange={this.updateValue} value={this.state.password} autoComplete="password"></input>
        </p>
        <p>
           <Button className="sign-in" onClick={this.validate}  style={{cursor: 'pointer'}} type="submit" label="Sign In"/>
        </p>
      </form>
    )
    return html;
  }
}
LoginScreen.contextTypes = {
    router: React.PropTypes.object
  };


export default LoginScreen;
