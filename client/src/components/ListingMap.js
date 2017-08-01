import React, {Component} from "react"

import GoogleMap from "react-google-map"
import GoogleMapLoader from "react-google-maps-loader"
// let markers = this.props.markers;
const google = window.google;

const MY_API_KEY = "82b44a7662b0abb55eebf365a61c50399b512935" // fake
let style={
  height:'60vh',
  width:'100%'
};
class Map extends Component{
  constructor(props){
    super(props);
    this.state={
      pt_center:this.props.center
    }
  }
  componentWillMount(){
    this.setState({
      pt_center:this.props.center
    });
  }
  componentDidMount(){

    this.setState({
      pt_center:this.props.center
    });
  }
  render(){
    let pt_center = (this.props.center.lat >0 ) ? this.props.center : {lat:0,lng:0};
    // console.log('the markerz: ',pt_center,pt_center.lat>0,pt_center.lat==0);
    let listing_marker = (this.props.listing_marker.position.lat>0) ? this.props.listing_marker : {title:"Toulouse",position:{lat:43.604363,lng: 1.443363}};
    if(pt_center.lat!==0 && listing_marker.position.lat>0){
      return(
      // GoogleMap component has a 100% height style.
      // You have to set the DOM parent height.
      // So you can perfectly handle responsive with differents heights.
      <div className="listing-map-object">
        <GoogleMap
          googleMaps={this.props.googleMaps}
          // You can add and remove coordinates on the fly.
          // The map will rerender new markers and remove the old ones.
          // coordinates = {markers}
          coordinates={[
            {
              title: "Toulouse",
              position: {
                lat: 43.604363,
                lng: 1.443363,
            },
              onLoaded: (googleMaps, map, marker) => {

                // Set Marker animation
                marker.setAnimation(googleMaps.Animation.DROP)


              },
            }
          ]
        }
          center={
            // {lat:0,lng:0}
            pt_center
          }
          zoom={12}
          onLoaded={(googleMaps, map) => {
            // map.setMapTypeId(googleMaps.MapTypeId.STREET)
            var marker1 = new google.maps.Marker(
              this.props.listing_marker
            );
            marker1.setAnimation(googleMaps.Animation.DROP);

            marker1.setMap(map);
          }}

        />
      </div>
    )}else{
      return(<div></div>);
    }
  }
}


export default GoogleMapLoader(Map, {
  libraries: ["places"],
  key: MY_API_KEY,
})
