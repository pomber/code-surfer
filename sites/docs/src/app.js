import React from "react";
import devImg from "./female-technologist_1f469-200d-1f4bb.png";
import useDimensions from "./use-dimensions";
import { CodeSurfer, nightOwl } from "@code-surfer/standalone";

const steps = [
  {
    code: `def partition(arr, low, high):
    i = low - 1 
    pivot = arr[high]

    for j in range(low, high):
        if arr[j] <= pivot:
            i = i + 1
            (arr[i], arr[j]) = (arr[j], arr[i])

    (arr[i + 1], arr[high]) = (arr[high], arr[i + 1])

    return i + 1

def quickSort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        
        quickSort(arr, low, pi - 1)
        quickSort(arr, pi + 1, high)`,
    lang: "py",
    subtitle: "With Code Surfer you can make Rad Code Slides, like this one"
  },
  {
    code: `function foo() {
  return 2;
}`,
    lang: "js"
  },
  {
    code: `function foo() {
  return 2;
}`,
    focus: "1[4:6]",
    lang: "js"
  }
];

function App() {
  const dimensions = useDimensions();
  const { perspective, origin } = dimensions;

  return (
    <div
      style={{
        backgroundColor: "#262626",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        perspective: `${perspective}px`,
        perspectiveOrigin: `${origin.x}px ${origin.y}px`,
        position: "relative",
        transformStyle: "preserve-3d"
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          // transform: "rotateY(57deg) rotateX(-13deg) scale(0.5)",
          transformStyle: "preserve-3d"
        }}
      >
        {/* <Header dimensions={dimensions} /> */}
        <Screen dimensions={dimensions} />
        <Floor dimensions={dimensions} />
        <Developer dimensions={dimensions} />
        <Podium dimensions={dimensions} />
        <Banners dimensions={dimensions} />
        <Content dimensions={dimensions} />
      </div>
    </div>
  );
}

function Header({ dimensions }) {
  return (
    <header
      style={{
        ...absoluteStyle(dimensions.header, dimensions.origin),
        background: "#999",
        fontSize: "1.5em",
        textAlign: "center",
        padding: "60px"
      }}
    >
      <h1>Code Surfer</h1>
    </header>
  );
}

function Screen({ dimensions }) {
  return (
    <div
      style={{
        ...absoluteStyle(dimensions.screen, dimensions.origin),
        background: "#666",
        border: `${dimensions.screen.width / 200}px solid #111`,
        fontSize: "2em"
      }}
    >
      <CodeSurfer progress={0} steps={steps} theme={nightOwl} />
    </div>
  );
}

function Developer({ dimensions }) {
  return (
    <img
      src={devImg}
      alt="technologist"
      style={{
        ...absoluteStyle(dimensions.dev, dimensions.origin)
      }}
    />
  );
}

function Podium({ dimensions }) {
  return (
    <div
      style={{
        ...absoluteStyle(dimensions.podium, dimensions.origin),
        background: "#222",
        color: "#fafafa",
        ...vstack,
        fontSize: "1.2rem"
      }}
    >
      <span>FOO</span>
      <span>CONF</span>
    </div>
  );
}

function Floor({ dimensions }) {
  const { floor } = dimensions;
  console.log(`${translate3d(floor)} rotateX(${floor.xangle}deg)}`);
  return (
    <div
      style={{
        ...absoluteStyle(floor, dimensions.origin),
        transform: `${translate3d(floor)} rotateX(${floor.xangle}deg)`,
        background: "#cd8500"
        // zIndex: -1
      }}
    />
  );
}

function Banners({ dimensions }) {
  const { banner } = dimensions;
  return (
    <React.Fragment>
      <Banner
        x={banner.leftx}
        angle={banner.leftangle}
        dimensions={dimensions}
      />
      <Banner
        x={banner.rightx}
        angle={banner.rightangle}
        dimensions={dimensions}
      />
    </React.Fragment>
  );
}

function Banner({ x, angle, dimensions }) {
  const { banner, origin } = dimensions;
  return (
    <div
      style={{
        ...absoluteStyle(banner, origin),
        background: "#aaa",
        transform: `translate3d(${x}px, ${banner.y}px, ${banner.z}px) rotateY(${angle}deg)`,
        ...vstack,
        justifyContent: "space-around",
        fontSize: "1.3rem",
        padding: "3% 1%"
      }}
    >
      <span style={{ fontSize: "1.5rem", textAlign: "center" }}>
        Platinum Sponsor
      </span>
      <span style={{ fontSize: "1.5rem", textAlign: "center" }}>
        Platinum Sponsor
      </span>
      <span>Gold Sponsor</span>
      <span>Gold Sponsor</span>
      <span>Gold Sponsor</span>
      <span>Gold Sponsor</span>
      <span>Silver Sponsor</span>
      <span>Silver Sponsor</span>
    </div>
  );
}

function Content({ dimensions }) {
  return (
    <div
      style={{
        ...absoluteStyle(dimensions.content, dimensions.origin),
        background: "#fafafa",
        height: "200vh"
      }}
    />
  );
}

function translate3d({ x, y, z }) {
  return `translate3d(${x}px, ${y}px, ${z}px)`;
}

function absoluteStyle(dims, origin) {
  return {
    position: "absolute",
    boxSizing: "border-box",
    width: dims.width,
    height: dims.height,
    left: origin.x + "px",
    top: origin.y + "px",
    transformStyle: "preserve-3d",
    transform: translate3d(dims)
  };
}

const vstack = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

export default App;
