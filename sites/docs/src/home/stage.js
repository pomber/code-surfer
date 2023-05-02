import React from "react";
import useWindowSize from "./use-window-size";
import Speaker from "./speaker";
import logo from "./logo.small.svg";
import bairesdev from "./logos/bairesdev.png";
import ocollective from "./logos/ocollective.svg";
import mdxdeck from "./logos/mdxdeck.png";
import wood from "./wood.png";
import brightSquares from "./bright-squares.png";
import purtyWood from "./purty-wood.png";
import shattered from "./shattered.png";

import {
  SceneContainer,
  SceneContent,
  Plane,
  Roof,
  Floor,
  RotateY,
  Move,
  useScale,
  SpotLight,
  NoLights,
  PointLight,
} from "react-vista";
const whiteBackground = "#FAF9F5";
const darkBackground = "#202226";
const dividerTexture = `url("${brightSquares}")`;

export default function Stage({ children, deck }) {
  const [vw, vh] = useWindowSize();
  if (!vw) return null;
  const h = Math.max((vw / vh < 1.16 ? vw / 1.16 : vh) * 0.75, 330);
  const scale = h * 0.2;
  const yMiddle = 0.28;
  const yOrigin = (0.6 * h) / vh;
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        background: darkBackground,
        color: "#222",
      }}
    >
      <SceneContainer
        style={{ height: "100%", width: "100%" }}
        perspective={12}
        origin={{ x: 0.5, y: yOrigin }}
        scale={scale}
      >
        <SceneContent
          style={{
            height: h,
            width: "100%",
            // borderBottom: '1px red solid',
          }}
          origin={{ x: 0.5, y: yMiddle }}
        >
          <StageObjects
            sceneWidth={vw / scale}
            sceneHeight={h / scale}
            yMiddle={yMiddle}
            deck={deck}
          />
        </SceneContent>
        <div
          style={{
            background: "#FAF9F5",
            transformStyle: "preserve-3d",
            marginTop: -1,
          }}
        >
          <div
            style={{
              position: "relative",
              height: h * 0.15,
              width: vw,
              backgroundImage: dividerTexture,
              backgroundColor: darkBackground,
              backgroundPosition: "center top",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              height={h * 0.2}
              width="100%"
              style={{
                zIndex: "1",
                position: "absolute",
                bottom: -1,
                height: "90%",
              }}
            >
              <path
                fill={whiteBackground}
                d="M0,192L40,186.7C80,181,160,171,240,144C320,117,400,75,480,74.7C560,75,640,117,720,122.7C800,128,880,96,960,90.7C1040,85,1120,107,1200,138.7C1280,171,1360,213,1400,234.7L1440,256L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
              ></path>
            </svg>
          </div>
          {children}
        </div>
      </SceneContainer>
    </div>
  );
}

function StageObjects({ sceneWidth, sceneHeight, yMiddle, deck }) {
  const startZ = -4;
  const [lightsOn, setLightsOn] = React.useState(false);
  return (
    <React.Fragment>
      {lightsOn && <Lights />}
      <Move dz={startZ - 4}>
        <NoLights>
          <Screen deck={deck} />
        </NoLights>
      </Move>
      <Move dz={startZ - 3} dy={-2.7}>
        <Top />
      </Move>
      {sceneWidth > 7 && (
        <React.Fragment>
          <Move dx={-5} dz={startZ - 3} dy={0.5}>
            <RotateY degrees={15}>
              <Banner />
            </RotateY>
          </Move>
          <Move dx={5} dz={startZ - 3} dy={0.5}>
            <RotateY degrees={-15}>
              <Banner />
            </RotateY>
          </Move>
        </React.Fragment>
      )}
      <Move dy={3.2} dx={2} dz={startZ - 1}>
        <Pulpit onClick={() => setLightsOn((on) => !on)} />
      </Move>
      <Move dy={3.1} dz={startZ}>
        <Platform />
      </Move>
      <NoLights>
        <Divider
          sceneWidth={sceneWidth}
          sceneHeight={sceneHeight}
          yMiddle={yMiddle}
        />
      </NoLights>
    </React.Fragment>
  );
}

function Screen({ deck }) {
  const scale = useScale();
  const deckWidth = 800;
  return (
    <Plane w={8.2} h={4.7} style={{ background: "#111", padding: scale * 0.1 }}>
      <div
        style={{
          width: deckWidth,
          height: (deckWidth * 9) / 16,
          transform: `scale(${(scale * 8) / deckWidth})`,
          transformOrigin: "left top",
        }}
      >
        {deck}
      </div>
    </Plane>
  );
}

function Top() {
  const width = 10;
  return (
    <React.Fragment>
      {/* roof */}
      <Roof
        pinY="top"
        h={2}
        w={width}
        style={{
          background: "#161616",
          backgroundImage: `url("${wood}")`,
        }}
      />
      {/* front */}
      <Plane
        pinY="bottom"
        h={1}
        w={width}
        style={{
          background: "#111",
          backgroundImage: `url("${wood}")`,
        }}
      />
    </React.Fragment>
  );
}

function Platform() {
  const width = 14;
  return (
    <React.Fragment>
      {/* floor */}
      <Floor
        pinY="bottom"
        h={5}
        w={width}
        style={{
          background: "#161616",
          backgroundImage: `url("${wood}")`,
        }}
      />
      {/* front */}
      <Plane
        pinY="top"
        h={1.5}
        w={width}
        style={{
          background: "#111",
          backgroundImage: `url("${wood}")`,
        }}
      />
    </React.Fragment>
  );
}

function Pulpit({ onClick }) {
  const w = 0.5;
  const h = 0.9;
  const scale = useScale();
  return (
    <React.Fragment>
      <Plane
        w={w}
        h={h}
        style={{
          background: "#333",
          color: "#FFFA",
          textAlign: "center",
          fontFamily: "monospace",
          backgroundImage: `url("${purtyWood}")`,
          userSelect: "none",
          cursor: "pointer",
        }}
        pinY={"bottom"}
        onClick={onClick}
      >
        <div style={{ fontSize: scale * 0.2, paddingTop: "40%" }}>RAD</div>
        <div style={{ fontSize: scale * 0.15 }}>CONF</div>
      </Plane>
      <Plane w={w} h={w} z={-0.2} y={-h * 0.93} pinY={"bottom"}>
        <Speaker />
      </Plane>
    </React.Fragment>
  );
}

function Banner() {
  const scale = useScale();
  return (
    <Plane
      w={1.5}
      h={4}
      style={{
        background: "#999",
        backgroundImage: `url("${shattered}")`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${scale * 0.25}px 0`,
          height: "100%",
          boxSizing: "border-box",
          opacity: 0.7,
          transformStyle: "preserve-3d",
        }}
      >
        <a
          href="https://github.com/pomber/code-surfer"
          style={{ width: "70%" }}
        >
          <img src={logo} alt="Code Surfer Logo" width="100%" />
        </a>
        <a
          href="https://github.com/jxnblk/mdx-deck/"
          style={{
            width: "80%",
            textDecoration: "none",
            color: "black",
            fontSize: scale * 0.19,
            fontWeight: "bolder",
            textAlign: "center",
            display: "flex",
          }}
        >
          <img
            src={mdxdeck}
            alt="MDX Deck Logo"
            width="35%"
            height={scale * 0.5}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "1.1em" }}>MDX</div>
            <div>Deck</div>
          </div>
        </a>
        <a
          href="https://www.bairesdev.com/sponsoring-open-source-projects/"
          style={{ width: "95%" }}
        >
          <img src={bairesdev} alt="BairesDev Logo" width="100%" />
        </a>
        <a
          href="https://opencollective.com/code-surfer#sponsor"
          style={{
            width: "80%",
            textDecoration: "none",
            color: "rgb(15, 35, 50)",
            fontSize: scale * 0.16,
            fontWeight: "bolder",
            textAlign: "center",
            display: "flex",
          }}
        >
          <img src={ocollective} alt="Open Collective Logo" width="30%" />
          <div style={{ flex: 1 }}>
            <div>Become a</div>
            <div style={{ fontSize: "1.2em" }}>Sponsor</div>
          </div>
        </a>
      </div>
    </Plane>
  );
}

function Divider({ sceneWidth, sceneHeight, yMiddle }) {
  return (
    <Floor
      style={{
        background: darkBackground,
        backgroundImage: dividerTexture,
        backgroundPosition: "center bottom",
      }}
      h={8}
      w={sceneWidth * 1.7}
      y={sceneHeight * (1 - yMiddle)}
      pinY="bottom"
    />
  );
}

function Lights() {
  const orange = "#f9bc00";
  const blue = "#539ed8";
  const pink = "#c30083";
  return (
    <React.Fragment>
      <PointLight color="#333" z={10} />
      <SpotLight y={-5} color={blue} z={-2} toZ={-4} toX={-0.5} x={-2} />
      <SpotLight y={-5} color={blue} z={-2} toZ={-4} toX={2} x={-2} />
      <SpotLight y={-5} color={orange} z={-2} toZ={-4} toX={1} x={0} />
      <SpotLight y={-5} color={orange} z={-2} toZ={-4} toX={-1} x={-1.5} />
      <SpotLight y={-5} color={pink} z={-2} toZ={-4} toX={2.5} x={2} />
      <SpotLight color={pink} x={-5} y={4} z={-5} toX={-5} toY={2} toZ={-6} />
      <SpotLight color={pink} x={5} y={4} z={-5} toX={5} toY={2} toZ={-6} />
    </React.Fragment>
  );
}
