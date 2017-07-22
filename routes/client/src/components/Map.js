import React, { Component } from 'react';
import { withGoogleMap, InfoWindow, GoogleMap, Marker, Polygon } from "react-google-maps";
import DrawingManager from "react-google-maps/lib/drawing/DrawingManager";
const google = window.google;

class Map extends Component{
  constructor(props){
    super(props);
    this.state={
      showing: false,
      target:'',
      markers: this.props.markers
    }
  }


  handleMapLoad(map) {
    console.log('fitting bounds to: ',this.state.markers);
    // this._mapComponent = map;
    // if (map) {
    //   map.fitBounds(this.state.markers);
    // }
  }

  displayMapInfo(marker){
    console.log('marker: ',marker);
  }

  handleMarkerClick = this.handleMarkerClick.bind(this);
  handleMarkerClose = this.handleMarkerClose.bind(this);
  handleMapClick = this.handleMapClick.bind(this);
  handleMarkerClick(targetMarker){
    this.setState({
     markers: this.state.markers.map(marker => {
       if (marker === targetMarker) {
         return {
           ...marker,
           showInfo: true,
         };
       }else{
         return {
           ...marker,
           showInfo: false,
         };
       }
       return marker;
     }),
   });
  }
  handleMarkerClose(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: false,
          };
        }
        return marker;
      }),
    });
  }
  handleMapClick(){
    this.setState({
      markers: this.state.markers.map(marker => {
        // if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: false,
          };
        // }
        // return marker;
      }),
    });
  }

  GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
      ref={props.onMapLoad}
      defaultZoom={9}
      defaultCenter={{ lat: 38.904373, lng: -77.053513 }}
      onClick={props.onMapClick}
    >
      {props.markers.map((marker, index) => (
        <Marker key={index}
          onClick = {()=>props.onMarkerClick(marker)}
          {...marker}>
          {marker.showInfo && (
           <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
             <div>{marker.infoContent}</div>
           </InfoWindow>
         )}
        </Marker>
      ))}
      <DrawingManager
        // onOverlayComplete={onClick}
        onOverlayComplete={this.onClick.bind(this)}
        defaultOptions={{
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.POLYGON,
              google.maps.drawing.OverlayType.RECTANGLE
            ],
          },
          circleOptions: {
            fillColor: `#ffff00`,
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1,
          },
        }}
      />
    </GoogleMap>
  ));
  onClick(e){
    const type = e.type; // "CIRCLE", "POLYGON", etc
    const overlay = e.overlay; // regular Google maps API object
    // google.maps.event.clearInstanceListeners(overlay);
    // overlay.setMap(null);
    let vertices = overlay.getPath().getLength();
    let lng = overlay.getPath().getAt(2).lng();

    let nodes = overlay.getPath();
    let contentString=[];
    for (var i =0; i < nodes.getLength(); i++) {
        let xy = nodes.getAt(i);
        let lat = xy.lat();
        let lng = xy.lng();
        contentString.push({
          lat,
          lng
        });
      }
    console.log(contentString);
    let markers = this.state.markers.map((marker)=>{
      return{
        lat:marker.position.lat,
        lng:marker.position.lng
      }
    });
    console.log('getting area of polygon: ',contentString,' to compare to: ',markers);
    // this.setState({
    //   markers
    // });
  }
  render(){
    let GettingStartedGoogleMap = this.GettingStartedGoogleMap;
    return(
      <div className="map-frame">
        <GettingStartedGoogleMap
            containerElement={
              <div style={{ height: `100%` }} />
            }
            mapElement={
              <div style={{ height: `100%` }} />
            }
            displayMapInfo={this.displayMapInfo.bind(this)}
            onMapLoad={this.handleMapLoad.bind(this)}
            markers={this.state.markers}
            onMarkerClick={this.handleMarkerClick}
            onMarkerClose={this.handleMarkerClose}
            onMapClick={this.handleMapClick}
          />
        </div>
    );
  }
}

export default Map;
