import React, { Component } from "react";
import { Link } from "react-router-dom";

/**
 * Rounds Component
 * - renders props for each round
 */
class Rounds extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <Link>{this.props.round.title}</Link>
                <input type="number" min="1" />
                <select>
                    <option value="1">Option 1</option>
                </select>
                <select>
                    <option value="2">Option 2</option>
                </select>
                <select>
                    <option value="3">Option 3</option>
                </select>
                <button>Delete</button>
            </div>
        );
    }
}

export default Rounds;
