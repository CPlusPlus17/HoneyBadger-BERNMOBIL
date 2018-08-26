import React from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Lo from "lodash";

class Websocket extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.connect();
    }

    render() {
        return null;
    }

  initStompClient() {
    this.client = new WebSocket(this.props.url);

        this.client.onmessage = msg => {
            this.props.onMessage(msg.data);
            return false;
        };
    }

    connect() {
        this.initStompClient();
    }
}

export default Websocket;
