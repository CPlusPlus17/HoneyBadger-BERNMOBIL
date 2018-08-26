import React, { Component } from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import axios from "axios";
// using webpack json loader we can import our geojson file like this
import geojson from "json-loader!./bk_subway_entrances.geojson";
// import local components Filter and ForkMe
import Filter from "./Filter";
import Websocket from "./Websocket";

// store the map configuration properties in an object,
// we could also move this to a separate file & import it if desired.
let config = {};
config.params = {};

config.tileLayer = {
    uri: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    params: {
        minZoom: 11,
        attribution:
            "Bernmobil App by Honeybadger <img style='height:10px;width:auto; margin-right:10px;' alt='badger' src='src/assets/smallbadger.png'>",
        id: "",
        accessToken: ""
    }
};

// array to store unique names of Brooklyn subway lines,
// this eventually gets passed down to the Filter component
let subwayLineNames = [];

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            tileLayer: null,
            geojsonLayer: null,
            geojson: null,
            subwayLinesFilter: "*",
            numEntrances: null,
            geolocationLoading: true,
            config: {
                center: null,
                zoomControl: false,
                zoom: 16,
                maxZoom: 19,
                minZoom: 11,
                scrollwheel: false,
                legends: true,
                infoControl: false,
                attributionControl: true
            },
            showPopup: false,
            currentVehicle: {
                name: "",
                subname: "",
                linie: ""
            }
        };
        this._mapNode = null;
        this.updateMap = this.updateMap.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
        this.pointToLayer = this.pointToLayer.bind(this);
        this.filterFeatures = this.filterFeatures.bind(this);
        this.filterGeoJSONLayer = this.filterGeoJSONLayer.bind(this);
        this.handleWebsocketData = this.handleWebsocketData.bind(this);

        // Implemented custom native click event for unclickable svg elements
        document.querySelector("html").onclick = function(event){
            if (event.target.nodeName.toLowerCase() == "img") {
                var allRedDotsVisible = document.querySelectorAll(".leaflet-pane svg g path")
                allRedDotsVisible = Array.prototype.slice.call(allRedDotsVisible).filter(function(item){
                    return item.getBoundingClientRect().width > 0
                })
                console.log(allRedDotsVisible, {event})
                var x = event.pageX;    
                var y = event.pageY;
                allRedDotsVisible.filter(function(item){
                    var dotX = item.getBoundingClientRect().x;
                    var dotY = item.getBoundingClientRect().y;
                    var maxDotX = x + item.getBoundingClientRect().width;
                    var maxDotY = y + item.getBoundingClientRect().height;
                    console.log(x, dotX, y, dotY, maxDotX, maxDotY);
                    if(x > dotX && x < maxDotX && y > dotY && y < maxDotY){
                        this.showPopup = true;
                        document.querySelector(".popup").style.display = "inline-block"
                        // Id is passed by stroke since we dont have other options
                        var id = item.getAttribute("stroke").split('#')[1];
                        
                        var vehicle = this.state.geojson.features.filter(function(item){
                            if(item.properties){
                                return item.properties.filter(function(property){
                                    return property.id === "Vehiclenumber";
                                })[0].address === id
                            }
                        })[0];
    
                        if(vehicle){
                            var customName = vehicle.properties.filter(function(property){
                                return property.id === "Category";
                            })[0].address + " " + id;
                            var customSubname = vehicle.properties.filter(function(property){
                                return property.id === "Beschreibung";
                            })[0].address;
                            var customLinie = vehicle.properties.filter(function(property){
                                return property.id === "Linie";
                            })[0].address;
                            var customVehicle = {
                                name: customName,
                                subname: customSubname,
                                linie: customLinie
                            };
                            this.setState({ currentVehicle: customVehicle })
                        }
                    }
                }.bind(this));
            }
           
        }.bind(this);
    }

    timeoutLoop() {
        const that = this;

        setTimeout(() => {
            if (that.state.geolocationLoading) {
                that.initialize();
            } else {
                that.timeoutLoop();
            }
        }, 100);
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(position => {
            this.state.config.center = [position.coords.latitude, position.coords.longitude];
            this.setState({ geolocationLoading: true });
        });

        this.timeoutLoop();
    }

    initialize() {
        // code to run just after the component "mounts" / DOM elements are created
        // we could make an AJAX request for the GeoJSON data here if it wasn't stored locally
        this.getData();
        // create the Leaflet map object
        if (!this.state.map) this.init(this._mapNode);
    }

    componentDidUpdate(prevProps, prevState) {
        // code to run when the component receives new props or state
        // check to see if geojson is stored, map is created, and geojson overlay needs to be added
        if (this.state.geojson && this.state.map && !this.state.geojsonLayer) {
            // add the geojson overlay
            this.addGeoJSONLayer(this.state.geojson);
        }

        // check to see if the subway lines filter has changed
        if (this.state.subwayLinesFilter !== prevState.subwayLinesFilter) {
            // filter / re-render the geojson overlay
            this.filterGeoJSONLayer();
        }
    }

    componentWillUnmount() {
        // code to run just before unmounting the component
        // this destroys the Leaflet map object & related event listeners
        this.state.map.remove();
    }

    getData() {
        axios
            .get("https://bernmobil20180825122419.azurewebsites.net/api/bernmobil/test2")
            .then(result => {
                let geojson = result.data;
                this.setState({
                    numEntrances: geojson.features.length,
                    geojson
                });
            })
            .catch(err => {
                console.log("etwas ging nicht", err);
            });
    }

    updateMap(e) {
        let subwayLine = e.target.value;
        // change the subway line filter
        if (subwayLine === "All lines") {
            subwayLine = "*";
        }
        // update our state with the new filter value
        this.setState({
            subwayLinesFilter: subwayLine
        });
    }

    addGeoJSONLayer(geojson) {
        if (this.state.geojsonLayer) {
            this.state.map.removeLayer(this.state.geojsonLayer);
        }

        // create a native Leaflet GeoJSON SVG Layer to add as an interactive overlay to the map
        // an options object is passed to define functions for customizing the layer
        var geojsonLayer = L.geoJson(geojson, {
            onEachFeature: this.onEachFeature,
            pointToLayer: this.pointToLayer,
            filter: this.filterFeatures
        });

        // add our GeoJSON layer to the Leaflet map object
        geojsonLayer.addTo(this.state.map);
        // store the Leaflet GeoJSON layer in our component state for use later
        this.setState({ geojsonLayer });
        // fit the geographic extent of the GeoJSON layer within the map's bounds / viewport
        // this.zoomToFeature(geojsonLayer);
    }

    filterGeoJSONLayer() {
        // clear the geojson layer of its data
        this.state.geojsonLayer.clearLayers();
        // re-add the geojson so that it filters out subway lines which do not match state.filter
        this.state.geojsonLayer.addData(geojson);
        // fit the map to the new geojson layer's geographic extent
        //this.zoomToFeature(this.state.geojsonLayer);
    }

    zoomToFeature(target) {
        // pad fitBounds() so features aren't hidden under the Filter UI element
        var fitBoundsParams = {
            paddingTopLeft: [200, 10],
            paddingBottomRight: [10, 10]
        };
        // set the map's center & zoom so that it fits the geographic extent of the layer
        //this.state.map.fitBounds(target.getBounds(), fitBoundsParams);
    }

    filterFeatures(feature, layer) {
        // filter the subway entrances based on the map's current search filter
        // returns true only if the filter value matches the value of feature.properties.LINE
        //const test = feature.properties.LINE.split("-").indexOf(this.state.subwayLinesFilter);
        if (this.state.subwayLinesFilter === "*" || test !== -1) {
            return true;
        }
    }

    pointToLayer(feature, latlng) {
        // renders our GeoJSON points as circle markers, rather than Leaflet's default image markers
        // parameters to style the GeoJSON markers
        var id = "#";
        if(feature.properties){
            id += feature.properties.filter(function(item){
                return item.id === "Vehiclenumber"
            })[0].address
        }
        var markerParams = {
            radius: 4,
            fillColor: "#de2236",
            color: id,
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.8
        };
        
        return L.circleMarker(latlng, markerParams);
    }

    onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.NAME && feature.properties.LINE) {
            // if the array for unique subway line names has not been made, create it
            // there are 19 unique names total
            if (subwayLineNames.length < 19) {
                // add subway line name if it doesn't yet exist in the array
                feature.properties.LINE.split("-").forEach(function(line, index) {
                    if (subwayLineNames.indexOf(line) === -1) subwayLineNames.push(line);
                });

                // on the last GeoJSON feature
                if (this.state.geojson.features.indexOf(feature) === this.state.numEntrances - 1) {
                    // use sort() to put our values in alphanumeric order
                    subwayLineNames.sort();
                    // finally add a value to represent all of the subway lines
                    subwayLineNames.unshift("All lines");
                }
            }

            // assemble the HTML for the markers' popups (Leaflet's bindPopup method doesn't accept React JSX)
            const popupContent = `<h3>${feature.properties.NAME}</h3>
        <strong>Access to MTA lines: </strong>${feature.properties.LINE}`;

            // add our popups
            layer.bindPopup(popupContent);
        }
    }

    init(id) {
        if (this.state.map) return;
        // this function creates the Leaflet map object and is called after the Map component mounts
        let map = L.map(id, this.state.config);
        L.control.zoom({ position: "topleft" }).addTo(map);
        //L.control.scale({ position: "bottomleft" }).addTo(map);

        // a TileLayer is used as the "basemap"
        const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);

        // set our state to include the tile layer
        this.setState({ map, tileLayer });
    }

    handleWebsocketData(data) {
        let geojson = JSON.parse(data);
        this.setState({
            numEntrances: geojson.features.length,
            geojson
        });
        this.addGeoJSONLayer(geojson);
    }

    filterSpecialCars(event) {
        if (event.currentTarget.checked) {
            console.log(event, "on");
        } else {
            console.log(event, "off");
        }
    }

    handlePopupClose() {
        document.querySelector(".popup").style.display = "none";
    }

    render() {
        const { subwayLinesFilter } = this.state;
        return (
            <div>
                <div className="popup" style={ this.showPopup ?   { display:'block'} : {display : 'none'} } >
                    <div className="popupinnerWrapper">
                        <h3>{this.state.currentVehicle ? this.state.currentVehicle.name : ''}</h3>
                        <h5>{this.state.currentVehicle ? this.state.currentVehicle.subname : ''}</h5>
                        <h5>{this.state.currentVehicle ? this.state.currentVehicle.linie : ''}</h5>
                        <span className="popupExitButton" onClick={this.handlePopupClose.bind(this)}>x</span>
                    </div>
                </div>
                <div className="formset special">
                    <label htmlFor="specialFilter">
                        Spezialfahrzeug
                        <input
                            onChange={this.filterSpecialCars}
                            type="checkbox"
                            name="specialFilter"
                            id="specialFilter"
                        />
                        <span className="checkmark" />
                    </label>
                </div>
                <div id="mapUI">
                    <div ref={node => (this._mapNode = node)} id="map" />
                    <Websocket
                        url="wss://bernmobil20180825122419.azurewebsites.net/"
                        onMessage={this.handleWebsocketData}
                    />
                </div>
            </div>
        );
    }
}

const wrapper = document.getElementById("App");
wrapper ? ReactDOM.render(<Map />, wrapper) : false;

export default Map;
