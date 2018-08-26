import React from "react";
import ReactDOM from "react-dom";
//import homeIcon from "../../assets/icn-home-active.png";

const Footer = () => (
    <div className="footerButtons">
        <a href="/src/home.html" className="mainButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="19" viewBox="0 0 22 19">
                <path fill="#000" fillRule="nonzero" d="M0 19V6l11-6 11 6v13h-8v-5H8v5z" opacity=".5" />
            </svg>
        </a>
        <a href="/" className="mainButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" viewBox="0 0 30 24">
                <g fill="none" fillRule="evenodd">
                    <path
                        stroke="#DF2B3F"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.167"
                        d="M-.808 18.613L14.95 13.81l15.758 4.803-15.758 4.803-15.758-4.803z"
                    />
                    <path
                        fill="#DF2B3F"
                        d="M15.036 18.794S9.979 8.511 9.979 5.722c0-2.788 2.248-5.05 5.021-5.05 2.773 0 5.02 2.262 5.02 5.05 0 2.789-4.984 13.072-4.984 13.072zm.165-10.85a2.417 2.417 0 0 0 2.41-2.424 2.417 2.417 0 0 0-2.41-2.423 2.417 2.417 0 0 0-2.41 2.423 2.417 2.417 0 0 0 2.41 2.424z"
                    />
                </g>
            </svg>
        </a>
    </div>
);

export default Footer;
