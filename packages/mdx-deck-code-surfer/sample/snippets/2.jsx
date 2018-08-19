export class Content extends React.Component {
  render() {
    const {
      type,
      children,
      className,
      ...rest
    } = this.props
    return React.createElement(
      type || "div",
      {
        className: contentClassName + " " + className,
        style: {
          display: "inline-block",
          textAlign: "left",
          width: "100%"
        },
        ...rest
      },
      children
    )
  }
}

export class Element extends React.Component {
  render() {
    const {
      type,
      selected,
      children,
      className,
      ...rest
    } = this.props
    return React.createElement(
      type || "div",
      {
        className: selected
          ? selectedClassName + " " + className
          : className,
        ...rest
      },
      children
    )
  }
}
