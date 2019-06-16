import React from "react";
import Row from "./row";

export default class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Mary",
    };
    this.handleNameChange = this.handleNameChange.bind(
      this
    );
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  render() {
    return (
      <section>
        <Row label="Name">
          <input
            value={this.state.name}
            onChange={this.handleNameChange}
          />
        </Row>
      </section>
    );
  }
}
