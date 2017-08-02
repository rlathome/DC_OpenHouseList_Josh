import React, { Component } from 'react';
import axios from 'axios';

class AddAgents extends Component{
  submitForm(){
    let url="http://localhost:8080/info/createagent";
    console.log('submitting');
    let firstname = this.refs.firstname.value;
    let lastname = this.refs.lastname.value;
    let headshot_url = this.refs.headshot_url.value;
    let email = this.refs.email.value;
    let address = this.refs.address.value;
    let phone = this.refs.phone.value;
    let facebook_url = this.refs.facebook_url.value;
    let instagram_url = this.refs.instagram_url.value;
    let linkedin_url = this.refs.linkedin_url.value;
    let password = this.refs.password.value;
    let data = {
      firstname,
      lastname,
      headshot_url,
      email,
      address,
      phone,
      facebook_url,
      instagram_url,
      linkedin_url,
      password
    }
    axios.post(url,data).then((response)=>{
      console.log('successfully submitted',response);

    }).catch((err)=>{
      console.log('err - ',err);
    });
  }
  render(){
    return(
      <div className="wrapper agent-form-container">
        <h1>Add a New Agent</h1>
        <form className="new-agent-form form form-default">
          <input className="form-control" ref="password" placeholder="Password"/>
          <input className="form-control" ref="firstname" placeholder="First Name"/>
          <input className="form-control" ref="lastname" placeholder="Last Name"/>
          <input className="form-control" ref="headshot_url" placeholder="Headshot URL (use MLS photo)"/>
          <input className="form-control" ref="email" placeholder="email"/>
          <input className="form-control" ref="address" placeholder="Address"/>
          <input className="form-control" ref="phone" placeholder="Phone"/>
          <input className="form-control" ref="instagram_url" placeholder="Instagram"/>
          <input className="form-control" ref="linkedin_url" placeholder="LinkedIn"/>
          <input className="form-control" ref="facebook_url" placeholder="Facebook"/>
          <input onClick={this.submitForm.bind(this)} className="btn btn-default btn-success" value="Submit"/>
        </form>
      </div>
      );
    }
}

export default AddAgents;
