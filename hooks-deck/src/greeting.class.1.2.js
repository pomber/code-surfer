import React from "react";
import Row from "./row";

export default class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Mary"
    };
  }

  render() {
    return (
      <section>
        <Row label="Name">
          <input value={this.state.name} />
        </Row>
      </section>
    );
  }
}
