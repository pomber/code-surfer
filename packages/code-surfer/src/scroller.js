import React from "react";
import Tween from "component-tween";

const getNewCenter = (container, content, firstSelected, lastSelected) => {
  // debugger;
  const parentHeight = container.parentElement.offsetHeight;
  container.style.padding = `${parentHeight / 2}px 0`;

  firstSelected = firstSelected || content;
  lastSelected = lastSelected || firstSelected;
  const contentTop = content.offsetTop;
  const contentHeight = content.offsetHeight;

  const top = firstSelected.offsetTop;
  const bottom = lastSelected.offsetTop + lastSelected.offsetHeight;
  const selectedHeight = bottom - top;
  const middle = Math.floor((top + bottom) / 2);
  const containerHeight = container.offsetHeight;

  let scale = 1;
  if (selectedHeight > containerHeight) {
    scale = containerHeight / selectedHeight;
    const minScale = 0.2;
    scale = scale < minScale ? minScale : scale;
  }

  // center in the middle of the selected element
  let center = middle;
  // debugger;

  const scaledContentHeight = contentHeight * scale;
  const scaledSelectedHeight = selectedHeight * scale;
  const contentMargin = (contentHeight - scaledContentHeight) / 2;

  const halfContent = contentHeight / 2;
  if (scale !== 1) {
    center = (middle - halfContent) * scale + halfContent;
  }

  // console.log("top", top);
  // console.log("bottom", bottom);
  // console.log("containerHeight", containerHeight);
  // console.log("selectedHeight", selectedHeight);
  // console.log("scaledSelectedHeight", scaledSelectedHeight);
  // console.log("contentHeight", contentHeight);
  // console.log("scaledContentHeight", scaledContentHeight);

  if (containerHeight >= scaledContentHeight) {
    // center in the middle of the content
    center = contentHeight / 2;
  } else if (containerHeight >= scaledSelectedHeight) {
    const minScroll = contentMargin + containerHeight / 2;
    const maxScroll = contentHeight - contentMargin - containerHeight / 2;
    center = center < minScroll ? minScroll : center;
    center = center > maxScroll ? maxScroll : center;
  } else {
    // console.log("Bigger selected than container");
    center = (top - halfContent) * scale + halfContent + containerHeight / 2;
  }

  // console.log(center);
  return { center, scale };
};

const scrollTo = (container, content, center, scale, duration) => {
  const startY = container.scrollTop;

  const containerScale =
    container.getBoundingClientRect().height / container.offsetHeight;

  // TODO browser support?
  const startScale =
    content.getBoundingClientRect().height /
    content.offsetHeight /
    containerScale;

  const endY = center;

  const tween = Tween({ top: startY, scale: startScale })
    .ease("out-circ")
    .to({ top: endY, scale })
    .duration(duration);

  tween.update(o => {
    container.scrollTop = o.top | 0;
    content.style.transform = "scale(" + o.scale + ")";
  });
  tween.on("end", function() {
    animate = function() {};
  });

  function animate() {
    requestAnimationFrame(animate);
    tween.update();
  }
  animate();
};

const contentClassName = "scroll-content";
const selectedClassName = "scroll-selected";

export class Container extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  animate(duration) {
    const container = this.containerRef.current;
    const content = container.querySelector("." + contentClassName);
    const allSelected = container.querySelectorAll("." + selectedClassName);
    const firstSelected = allSelected.length ? allSelected[0] : content;
    const lastSelected = allSelected.length
      ? allSelected[allSelected.length - 1]
      : content;
    const { center, scale } = getNewCenter(
      container,
      content,
      firstSelected,
      lastSelected
    );
    scrollTo(container, content, center, scale, duration);
  }

  componentDidMount() {
    this.animate(1);
  }

  componentDidUpdate() {
    this.animate(700);
  }
  render() {
    const { type, height, children, ...rest } = this.props;
    return React.createElement(
      type || "div",
      {
        ref: this.containerRef,
        style: {
          height: 0,
          margin: 0,
          // background: "#222",
          // padding: this.props.height / 2 + "px 0",
          overflow: "hidden",
          textAlign: "center",
          position: "relative"
          // color: "#fafafa"
        },
        ...rest
      },
      <div style={{ position: "relative" }}>{children}</div>
    );
  }
}

export class Content extends React.Component {
  render() {
    const { type, children, className, ...rest } = this.props;
    return React.createElement(
      type || "div",
      {
        className: contentClassName + " " + className,
        style: { display: "inline-block", textAlign: "left", width: "100%" },
        ...rest
      },
      children
    );
  }
}

export class Element extends React.Component {
  render() {
    const { type, selected, children, className, ...rest } = this.props;
    return React.createElement(
      type || "div",
      {
        className: selected ? selectedClassName + " " + className : className,
        ...rest
      },
      children
    );
  }
}
