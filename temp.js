// import react
import React from 'react';
// import react dom
import ReactDOM from 'react-dom';
// import button from Bootstrap
import { Button } from 'react-bootstrap';
// import bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';

// Create a React Button Component
class Button extends React.Component {
    render() {
        return (
        <button className="btn btn-primary">
            {this.props.children}
        </button>
        );
    }
}