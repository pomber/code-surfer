import React from "react";
import Row from "./row";
import { ThemeContext, LocaleContext } from "./context";

export default class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Mary",
      surname: "Poppins",
      width: window.innerWidth,
    };
    this.handleNameChange = this.handleNameChange.bind(
      this
    );
    this.handleSurnameChange = this.handleSurnameChange.bind(
      this
    );
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    document.title =
      this.state.name + " " + this.state.surname;
    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate() {
    document.title =
      this.state.name + " " + this.state.surname;
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleSurnameChange(e) {
    this.setState({ surname: e.target.value });
  }

  handleResize() {
    this.setState({ width: window.innerWidth });
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {theme => (
          <section className={theme}>
            <Row label="Name">
              <input
                value={this.state.name}
                onChange={this.handleNameChange}
              />
            </Row>
            <Row label="Surname">
              <input
                value={this.state.surname}
                onChange={this.handleSurnameChange}
              />
            </Row>
            <LocaleContext.Consumer>
              {locale => (
                <Row label="Language">{locale}</Row>
              )}
            </LocaleContext.Consumer>
            <Row label="Width">{this.state.width}</Row>
          </section>
        )}
      </ThemeContext.Consumer>
    );
  }
}
