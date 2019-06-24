import React from "react";
import { globalHistory } from "@reach/router";
import { Zoom, Clock, Slide } from "mdx-deck";
import useSpring from "./use-spring";
import { getTextFromNotes } from "./notes";

const Teleprompter = ({ index, children, style }) => {
  const ref = React.useRef();
  const [target, setTarget] = React.useState(0);
  const scrollTop = useSpring({
    target,
    friction: 25
  });

  React.useEffect(() => {
    const self = ref.current;
    const child = self.children[index + 1];
    const childTop = child.offsetTop - self.offsetTop;
    const childHeight = child.getBoundingClientRect().height;
    const selfHeight = self.getBoundingClientRect().height;
    if (childHeight) {
      setTarget(childTop - selfHeight / 2 + (3 * childHeight) / 4);
    }
  }, [index]);

  React.useLayoutEffect(() => {
    ref.current.scrollTop = scrollTop;
  }, [scrollTop]);

  return (
    <div style={style} ref={ref}>
      <div style={{ height: "50%" }} />
      {children}
      <div style={{ height: "50%" }} />
    </div>
  );
};

function AllSlides({ context, slides, style }) {
  return (
    <div style={style}>
      {slides.map((Component, i) => (
        <Slide key={i} context={{ ...context, index: i }} index={i}>
          <Component />
        </Slide>
      ))}
    </div>
  );
}

export const Presenter = props => {
  const { slides, metadata, index, step } = props;

  const [areNotesReady, setNotesReady] = React.useState(false);
  React.useEffect(() => {
    setNotesReady(true);
  }, []);

  const allNotes = React.useMemo(() => {
    return slides.flatMap((slide, slideIndex) => {
      const { notes: slideNotes } = metadata[slideIndex] || { notes: "" };

      if (Array.isArray(slideNotes)) {
        return slideNotes.map((stepNotes, stepIndex) => ({
          notes: getTextFromNotes(stepNotes),
          slideIndex,
          stepIndex
        }));
      } else {
        return {
          notes: getTextFromNotes(slideNotes),
          slideIndex,
          stepIndex: "any"
        };
      }
    });
  }, [areNotesReady]);

  console.log(allNotes);

  const noteIndex = allNotes.findIndex(
    stepNotes =>
      stepNotes.slideIndex === index &&
      (stepNotes.stepIndex === "any" || stepNotes.stepIndex === step)
  );

  return (
    <div
      style={{
        color: "#fafafa",
        backgroundColor: "#222",
        display: "flex",
        height: "100vh",
        width: "100vw"
      }}
    >
      {!areNotesReady && (
        // Need to render all slides to run the effects that set the notes
        <AllSlides
          style={{ display: "none" }}
          context={props}
          slides={slides}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          boxSizing: "border-box"
        }}
      >
        <Zoom zoom={5 / 8}>{props.children}</Zoom>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "0 16px",
            background: "#333"
          }}
        >
          <pre>
            Slide {index + 1} of {slides.length}
          </pre>
          <Clock />
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={globalHistory.location.origin + globalHistory.location.pathname}
          style={{ color: "#bbb", padding: "10px" }}
        >
          Open Slides in New Window
        </a>
      </div>
      <div style={{ height: "100%", boxSizing: "border-box" }}>
        <Teleprompter
          index={noteIndex}
          style={{
            color: "#FFFF33",
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            height: "100%",
            width: "90%",
            margin: "5px auto"
          }}
        >
          {allNotes.map((note, i) => (
            <span style={{ opacity: noteIndex === i ? 1 : 0.5 }} key={i}>
              {note.notes}
            </span>
          ))}
        </Teleprompter>
      </div>
    </div>
  );
};

export default Presenter;
