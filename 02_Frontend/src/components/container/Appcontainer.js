import React, { Component } from "react";
import ReactDOM from "react-dom";
import App from "../presentational/App";
import { DivIcon } from "leaflet";

class Appcontainer extends Component {
    constructor() {
        super();

        const newImage = new DivIcon({ className: "leaf-red" });

        this.state = {
            marker: {
                lat: 46.9427801,
                lng: 7.4408217
            },
            icon: newImage
        };
    }

    componentDidMount() {}

    render() {
        return <App position={[46.94797, 7.44745]} zoom={20} icon={this.icon} />;
    }
}

const wrapper = document.getElementById("App");
wrapper ? ReactDOM.render(<Appcontainer />, wrapper) : false;

export default Appcontainer;
