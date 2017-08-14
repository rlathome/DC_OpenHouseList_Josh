import React, { Component } from 'react';
import axios from 'axios';
let apiKey="http://localhost:8080/";
// let apiKey="http://vast-shore-14133.herokuapp.com/";

class AddAgents extends Component{
  constructor(props){
    super(props);
    this.state={
      agents:''
    }
  }
  componentWillMount(){
    this.getAllAgents();
    this.getAllListings();
  }
  getAllAgents(){
    let url=apiKey+"info/getallagents";
    axios.get(url).then((response)=>{
      console.log('axios agents: ',response);
      let agents = response.data;
      this.setState({
        agents
      });
    }).catch((err)=>{
      console.log('err - ',err);
    });
  }
  getAllListings(){
    let url=apiKey+"info/getfeaturedlistings";
    axios.get(url).then((response)=>{
      console.log('axios rec listings: ',response);
      let listings = response.data.results;
      this.setState({
        listings
      });
    }).catch((err)=>{
      console.log('err - ',err);
    });
  }
  submitForm(){
    let url=apiKey+"info/createagent";
    console.log('submitting');
    let firstname = this.refs.firstname.value;
    let lastname = this.refs.lastname.value;
    let headshot_url = this.refs.headshot_url.value;
    let email = this.refs.email.value;
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
      phone,
      facebook_url,
      instagram_url,
      linkedin_url,
      password
    }
    axios.post(url,data).then((response)=>{
      console.log('successfully submitted',response);
      this.getAllAgents();
    }).catch((err)=>{
      console.log('err - ',err);
    });
  }
  submitListing(){
    let url=apiKey+"info/addfeatured";
    console.log('submitting');
    let mls = this.refs.mls.value;
    let password = this.refs.password.value;
    let data = {
      mls,
      password
    }
    axios.post(url,data).then((response)=>{
      console.log('successfully submitted',response);
      this.getAllListings();
    }).catch((err)=>{
      console.log('err - ',err);
    });
  }
  deleteAgent(e){
    e.preventDefault();
    let target = e.target;
    let id = target.id;
    let agentid = id;
    let password = this.refs[agentid].value;
    console.log('password: ',password);
    let data = {
      agentID:id,
      password
    }
    let url=apiKey+"info/deleteagent";
    console.log('clicked: ',id);
    let confirm = window.confirm('are you sure?');
    if(confirm){
      axios.post(url,data).then((response)=>{
        console.log('successfully submitted',response);
        if(response.data==='incorrect password'){
          alert('Incorrect Password');
        }
        this.getAllAgents();
      }).catch((err)=>{
        console.log('err - ',err);
      });
    }
  }
  deleteListing(e){
    e.preventDefault();
    let target = e.target;
    let id = target.id;
    let listingid = id;
    let password = this.refs[listingid].value;
    console.log('password: ',password);
    console.log('listing: ',listingid);
    let data = {
      listingID:id,
      password
    }
    let url=apiKey+"info/deletefeatured";
    console.log('clicked: ',id);
    let confirm = window.confirm('are you sure?');
    if(confirm){
      axios.post(url,data).then((response)=>{
        console.log('successfully submitted',response);
        if(response.data==='incorrect password'){
          alert('Incorrect Password');
        }
        this.getAllListings();
      }).catch((err)=>{
        console.log('err - ',err);
      });
    }
  }
  render(){
    let agentinfo = (this.state.agents) ? this.state.agents.map((agent)=>{
      return {
        email:agent.email,
        name:agent.name,
        headshot_url:agent.headshot_url,
        id:agent.id,
        phone:agent.phone
      }
    }) : '';
    let agents = (agentinfo) ? agentinfo.map((agent)=>{
      return(
        <div className='agent-thumbnail'>
          <div className='agent-thumb-info'>
            <div>{agent.name}</div>
            <div>{agent.email}</div>
            <div>{agent.phone}</div>
            <input ref={agent.id} placeholder="Password" />
            <div id={agent.id} onClick={this.deleteAgent.bind(this)} className='btn btn-default btn-danger'>Delete</div>
          </div>
          <img className='agent-thumb-img pull-right' src={agent.headshot_url} alt="agent photo" />
        </div>
      );
    }) : '';

    let listinginfo = (this.state.listings) ? this.state.listings.map((listing)=>{
      return {
        street_name:listing.street_name,
        street_number:listing.street_number,
        price:'$'+listing.list_price,
        mls_number:listing.mls_number,
        image:listing.image_urls.all_thumb[0],
        id:listing.id,
        agent_name:listing.agent_first_name+' '+listing.agent_last_name
      }
    }) : '';
    let listings = (listinginfo) ? listinginfo.map((listing)=>{
      return(
        <div className='agent-thumbnail clearfix'>
          <div className='agent-thumb-info'>
            <span>{listing.street_number}</span>
            <span>&nbsp;{listing.street_name}</span>
            <div>Agent:&nbsp;{listing.agent_name}</div>
            <div>{listing.price}&nbsp;</div>
            <div>{listing.mls_number}</div>
            <input ref={listing.mls_number} placeholder="Password" />
            <div id={listing.mls_number} onClick={this.deleteListing.bind(this)} className='btn btn-default btn-danger'>Delete</div>
          </div>
          <img className='agent-thumb-img pull-right image-responsive' src={listing.image} alt="agent photo" />
        </div>
      );
    }) : '';
    return(
      <div className="wrapper agent-form-container">
        <div className="row">
          <div className="col-sm-6">
          <h1>Add Agent</h1>
          <form className="new-agent-form form form-default">
            <input className="form-control" ref="password" placeholder="Password"/>
            <input className="form-control" ref="firstname" placeholder="First Name"/>
            <input className="form-control" ref="lastname" placeholder="Last Name"/>
            <input className="form-control" ref="headshot_url" placeholder="Headshot URL (use MLS photo)"/>
            <input className="form-control" ref="email" placeholder="email"/>
            <input className="form-control" ref="phone" placeholder="Phone (xxx) xxx-xxxx"/>
            <input className="form-control" ref="instagram_url" placeholder="Instagram"/>
            <input className="form-control" ref="linkedin_url" placeholder="LinkedIn"/>
            <input className="form-control" ref="facebook_url" placeholder="Facebook"/>
            <input onClick={this.submitForm.bind(this)} className="btn btn-default btn-success" value="Add"/>
          </form>
        </div>
          <div className="col-sm-6">
          <h1>Featured Open House</h1>
          <form className="new-agent-form form form-default">
            <input className="form-control" ref="password" placeholder="Password"/>
            <input className="form-control" ref="mls" placeholder="MLS number (of an open house)"/>
            <input onClick={this.submitListing.bind(this)} className="btn btn-default btn-success" value="Add"/>
          </form>
        </div>
        </div>
        <div className="admin-saved">
          <div className="agent-list">
            <h1>Agents</h1>
            <p>There is no limit to saved agents and they are displayed at random</p>
            { agents }
          </div>
          <div className="agent-list">
            <h1>Featured Open Houses</h1>
            <p>If no listings saved, site goes to default settings</p>
            { listings }
          </div>
        </div>
      </div>
      );
    }
}

export default AddAgents;
