import React from "react";
import { UnknownError } from "./errors";

export default class ErrorBoundary extends React.Component<
  {},
  { error?: any }
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // console.log(error, info);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    } else if (this.state.error.element) {
      return this.state.error.element;
    } else {
      console.error(this.state.error);
      return <UnknownError error={this.state.error} />;
    }
  }
}
