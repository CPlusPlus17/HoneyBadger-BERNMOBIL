import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { DivIcon } from "leaflet"

export default class MarkerComponent extends Component {
  constructor(){
    super()

    const newImage = new DivIcon({className: 'leaf-red'});

    var CustomIcon = L.Icon.extend({
      options: {
           iconUrl: './../../assets/leaf-red.png',
           shadowUrl: './../../assets/leaf-red.png',
           iconSize: new L.Point(32, 32),
           opacity: 0.5,
           //shadowSize: new L.Point(68, 95),
           iconAnchor: new L.Point(16, 16),
           popupAnchor: new L.Point(0, -18)
         }
       });

    this.state = {
      center: {
        lat: 46.94797,
        lng: 7.44745,
      },
      marker: {
        lat: 46.94797,
        lng: 7.44745,
      },
      zoom: 13,
      draggable: false,
      icon: CustomIcon
    }
    this.refmarker = React.createRef()
  }

  updatePosition() {
    const { lat, lng } = this.refmarker.current.leafletElement.getLatLng()
    this.setState({
      marker: { lat, lng },
    })
  }

  render() {
    const markerPosition = [this.state.marker.lat, this.state.marker.lng]

    return (
        <Marker
          draggable={this.state.draggable}
          onDragend={this.updatePosition}
          position={markerPosition}
          ref={this.refmarker}
          icon={this.icon}>
        </Marker>
    )
  }
}