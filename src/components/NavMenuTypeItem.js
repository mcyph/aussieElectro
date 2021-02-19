import React, {Component} from "react";

class NavMenuTypeItem extends Component {
    handleClick = () => {
        this.props.onClickA(this.props.type);
    }

    render() {
        return (
            <div onClick={this.handleClick} className={`navItem navItemColor ${this.props.active ? "navItemActive_" + this.props.type : ""}`}> {this.props.type} </div>

        );
    }
}

export default NavMenuTypeItem;
