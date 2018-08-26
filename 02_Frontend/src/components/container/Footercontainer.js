import React, { Component } from "react";
import ReactDOM from "react-dom";
import Footer from "../presentational/Footer";

class Footercontainer extends Component {
    constructor() {
        super();
    }

    componentDidMount() { }

    render() {
        return <Footer />;
    }
}

const wrapper = document.getElementById("footer");
wrapper ? ReactDOM.render(<Footercontainer />, wrapper) : false;

export default Footercontainer;
