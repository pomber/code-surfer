import React from "react";
import devImg from "./female-technologist_1f469-200d-1f4bb.png";
import useDimensions from "./use-dimensions";

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
      <Header dimensions={dimensions} />
      <Screen dimensions={dimensions} />
      <Floor dimensions={dimensions} />
      <Developer dimensions={dimensions} />
      <Podium dimensions={dimensions} />
      <Banners dimensions={dimensions} />
      <Content dimensions={dimensions} />
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
      <h3>build AWESOME CODE SLIDES with</h3>
      <h1>CODE SURFER</h1>
    </header>
  );
}

function Screen({ dimensions }) {
  return (
    <div
      style={{
        ...absoluteStyle(dimensions.screen, dimensions.origin),
        background: "#666",
        border: `${dimensions.screen.width / 200}px solid #111`
      }}
    />
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
        background: "#999",
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
        background: "#993d"
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
        background: "#966",
        transform: `translate3d(${x}px, ${banner.y}px, ${
          banner.z
        }px) rotateY(${angle}deg)`,
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
