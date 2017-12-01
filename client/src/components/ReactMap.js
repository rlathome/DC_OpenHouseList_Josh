import React, {Component} from "react";
import currency from 'currency-formatter';
import moment from 'moment';
import jquery from 'jquery';
import newN from './Neighborhoods';
import GoogleMap from "react-google-map";
import  MarkerClusterer  from "react-google-maps/lib/addons/MarkerClusterer";
import GoogleMapLoader from "react-google-maps-loader"
// let markers = this.props.markers;
const google = window.google;
let Neighborhoods = new newN;

// // console.log('West End: ',Neighborhoods[this.props.neighborhood]);

const MY_API_KEY = "82b44a7662b0abb55eebf365a61c50399b512935" // fake
let style={
  height:'60vh',
  width:'100%'
};
class FullMap extends Component{
  constructor(props){
    super(props);
    this.state={
      neighborhood:''
    }
  }
  viewListing(){
    // console.log('imported viewListing');
  }
  render(){
    let neighb = this.props.neighborhood;
    // console.log('neigh: ',neighb);
    // console.log('West End: ',Neighborhoods[neighb]);
    // console.log('r_map markers: ',this.props.markers);
    let neighborhood_polygon = (Neighborhoods[neighb] && neighb !== 'FullDCArea') ? Neighborhoods[neighb] : 'none';
    // console.log('neigh poly: ',neighborhood_polygon);
    let map_center = (Neighborhoods[neighb] && neighb !=='FullDCAarea') ? Neighborhoods[neighb][0] : Neighborhoods['dupontcircle'][0];
    // // console.log('map center: ',Neighborhoods[neighb]);
    // console.log('neighborhood params: ',this.props.neighborhood);
    let showing = (this.props.display) ? '' : 'hidden';
    return(
      // GoogleMap component has a 100% height style.
      // You have to set the DOM parent height.
      // So you can perfectly handle responsive with differents heights.
      <div className={showing} style={style}>
        <GoogleMap
          googleMaps={this.props.googleMaps}

          center={
            map_center
          }
          zoom={13}

          //HANDLE ALL GOOGLE MAPS INFO HERE:

          onLoaded={(googleMaps, map) => {
            // map.setMapTypeId(googleMaps.MapTypeId.STREET)
            var marker = new google.maps.Marker({
              position: {lat: 39.00702, lng: -77.13851},
              title:"Hello World!"
            });
            let viewListing = this.props.viewListing;

            // // console.log('map markers: ',this.props.markers);
            //FILTER BY NEIGHBORHOOD:
            if(neighb !=='FullDCArea'){
              var neighborhoodPolygon = new google.maps.Polygon({
                paths: neighborhood_polygon,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0320',
                fillOpacity: 0.35
              });
              neighborhoodPolygon.setMap(map);
            }

            //MARKER CLUSTERING

            //       let map_markers = this.props.markers.map((val)=>{
            //         return new google.maps.Marker({
            //           title:val.street_name,
            //           position: {
            //             lat: parseFloat(val.latitude),
            //             lng: parseFloat(val.longitude),
            //           }
            //         });
            //       // map_markers.push(map_marker);
            //     });
            // // let map_markers=[];
            // var markerCluster = new MarkerClusterer(map, map_markers,
            // {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
            // // console.log('clusterer: ',markerCluster);

            // markerCluster.setMap(map);
            // <MarkerClusterer averageCenter enableRetinaIcons={true} gridSize={30} zoomOnClick={false} onClick={(cluster)=> this.props.onClusterClicked(cluster)}></MarkerClusterer>

            var bounds = new google.maps.LatLngBounds();
            let num_markers = 0;
            let filtered_results = [];
            // if(this.props.markers) return;
            this.props.markers.forEach((val)=>{
              // // console.log('this marker is: ',val);
              let price = currency.format(val.list_price,{ code: 'USD', decimalDigits: 0 });
              price = price.slice(0,price.length-3);
              //get day of the week:
              let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
              let date = (val.open_house_events) ? moment(val.open_house_events[0].event_start) : '';
              let dow = (date) ? date.day() : '';
              let time = (date) ? date.format('h:mmA') : '';
              let dowUC = (date) ? days[dow] : '';
              dow = (date) ? days[dow] : '';
              dow = (date) ? dow.toLowerCase() : '';
              let lat = parseFloat(val.latitude);
              let lng = parseFloat(val.longitude);
              let marker = new google.maps.Marker(
                {
                  title:val.street_name,
                  position: {
                    lat: parseFloat(val.latitude),
                    lng: parseFloat(val.longitude),
                  },
                }
              );

              let map_markers = [];
              marker.setAnimation(googleMaps.Animation.DROP);
              let position = new google.maps.LatLng(lat,lng);
              // // console.log('gmap position: ',position);
              if(neighb == 'FullDCArea'){
                // console.log('plotting DC AREA marker!');
                marker.setMap(map);
                let boundary = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                bounds.extend(boundary);
                filtered_results.push(val);
                num_markers++;
                map_markers.push(marker);
              }else if(google.maps.geometry.poly.containsLocation(position, neighborhoodPolygon)){
                //place marker
                // // console.log('plotting marker!');
                marker.setMap(map);
                let boundary = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                bounds.extend(boundary);
                filtered_results.push(val);
                num_markers++;
                map_markers.push(marker);
              }
            //CREATE PROPERTY INFOWINDOW
            // let mls = val.mls_number.toString();
            // // console.log('listing id: ',val.id);
            // let mls = val.id.toString();
            let mls = val.id;
            let dir;
            switch(val.street_pre_direction){
              case 'Northwest':
              dir = 'NW';
              break;
              case 'Southwest':
              dir = 'SW';
              break;
              case 'Southeast':
              dir = 'SE';
              break;
              case 'Northeast':
              dir = 'NE';
              break;
              default:
              dir = '';
            };
            var contentString = (
              '<div id='+mls+' class="listing-popup" style='+
                'backgroundImage:url('+val.image_urls.all_thumb[1]+')'+
                '>'+
                '<div class="listing-popup-opacity"></div>'+
                '<div class="listing-popup-text">'+
                 val.street_number + ' ' + val.street_name + ' ' + val.street_post_dir +  ' ' + dir + ' '+ '('+dowUC+')'+ '<br/>'+
                 price +' <br/>'+
                '</div>'+
              '</div>'
            );

            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            marker.addListener('click', function() {
              infowindow.open(map, marker);
              let index = '#'+mls;
              let style = 'url('+val.image_urls.all_thumb[0]+')'
              jquery(index).css('background-image',style);
              jquery(index).css('background-image',style);
            });
            map.addListener('click',function(){
              infowindow.close(map,marker);
            });
            marker.addListener('mouseleave',function(){
              infowindow.close(map,marker);
            })
            google.maps.event.addListener(infowindow, 'domready', function() {
              let index = '#'+mls;
              jquery(index).on("click", function() {
                viewListing(mls);
              });
            });
            if(num_markers>0){
              map.fitBounds(bounds);
              // map.panToBounds(bounds);
              var listener = google.maps.event.addListener(map, "idle", function() {
                if (map.getZoom() > 16) map.setZoom(16);
                google.maps.event.removeListener(listener);
              });
            }
          });

        console.log('filtered_results in Map: ',filtered_results);
        this.props.updateResults(filtered_results);
          }}

        />
      </div>
    )
  }
}
// const Map = ({markers, googleMaps}) => (
//   // GoogleMap component has a 100% height style.
//   // You have to set the DOM parent height.
//   // So you can perfectly handle responsive with differents heights.
//   <div style={style}>
//     <GoogleMap
//       googleMaps={googleMaps}
//       // You can add and remove coordinates on the fly.
//       // The map will rerender new markers and remove the old ones.
//       coordinates={[
//         {
//           title: "Washington DC",
//           position: {
//             lat: 38.904373, lng: -77.053513
//           },
//           onLoaded: (googleMaps, map, markers) => {
//             // Set Marker animation
//             markers.setAnimation(googleMaps.Animation.BOUNCE)
//
//             // Define Marker InfoWindow
//             const infoWindow = new googleMaps.InfoWindow({
//               content: `
//                 <div>
//                   <h3>Toulouse<h3>
//                   <div>
//                     Toulouse is the capital city of the southwestern
//                     French department of Haute-Garonne,
//                     as well as of the Occitanie region.
//                   </div>
//                 </div>
//               `,
//             })
//
//             // Open InfoWindow when Marker will be clicked
//             // googleMaps.event.addListener(marker, "click", () => {
//             //   infoWindow.open(map, marker)
//             // })
//             //
//             // // Change icon when Marker will be hovered
//             // googleMaps.event.addListener(marker, "mouseover", () => {
//             //   marker.setIcon(iconMarkerHover)
//             // })
//             //
//             // googleMaps.event.addListener(marker, "mouseout", () => {
//             //   marker.setIcon(iconMarker)
//             // })
//
//             // Open InfoWindow directly
//             // infoWindow.open(map, marker)
//           },
//         }
//       ]}
//       center={
//         { lat: 38.904373, lng: -77.053513 }
//       }
//       zoom={8}
//       onLoaded={(googleMaps, map) => {
//         map.setMapTypeId(googleMaps.MapTypeId.SATELLITE)
//       }}
//     />
//   </div>
// )

// Map.propTypes = {
//   googleMaps: PropTypes.object.isRequired,
// }

export default GoogleMapLoader(FullMap, {
  libraries: ["places"],
  key: MY_API_KEY,
})
