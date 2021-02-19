import React, {Component} from "react";
import StackedBarChart from "./StackedBarChart";

class StackedBar extends Component {
    render() {
        return (
            <div className="mapBorder" style={{ height: this.props.height }} id="stackedBar">
                <StackedBarChart percentages={this.props.percentages} width={85} height={this.props.height} />
            </div>
        )
    }
}

export default StackedBar;
