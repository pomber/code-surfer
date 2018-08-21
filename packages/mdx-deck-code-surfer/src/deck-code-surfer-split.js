import CodeSurfer from "code-surfer";
import React from "react";
import { modes, incStep, decStep } from "mdx-deck";
import { withDeck } from "mdx-deck/dist/context";
import { withSlide } from "mdx-deck/dist/Slide";

export default withDeck(
  withSlide(
    class extends React.Component {
      componentDidMount() {
        document.body.addEventListener("keydown", this.handleKeyDown);
      }

      componentWillUnmount() {
        document.body.removeEventListener("keydown", this.handleKeyDown);
      }

      shouldComponentUpdate() {
        return this.props.deck.index === this.props.slide.index;
      }

      handleKeyDown = e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (this.props.deck.index !== this.props.slide.index) return;
        const { update } = this.props.deck;
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            update(incStep(this.props.stepsTop));
            break;
          case "ArrowUp":
            e.preventDefault();
            update(decStep());
            break;
        }
      };

      render() {
        const {
          codeTop,
          codeBottom,
          stepsTop,
          stepsBottom,
          title,
          showNumbers,
          notes
        } = this.props;
        const { step, mode } = this.props.deck;
        const currentStepTop =
          step < 0 ? { notes } : stepsTop[step] || stepsTop[0];
        const currentStepBottom =
          step < 0 ? { notes } : stepsBottom[step] || stepsBottom[0];

        const topSize = codeTop.split("\n").length - 1;
        const bottomSize = codeBottom.split("\n").length - 1;

        return (
          <div
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div style={{ flex: topSize, overflow: "hidden" }} key="codeTop">
              <CodeSurfer
                code={codeTop}
                step={currentStepTop}
                showNumbers={showNumbers}
              />
            </div>
            <div style={{ height: "25px" }} />
            <div
              style={{ flex: bottomSize, overflow: "hidden" }}
              key="codeBottom"
            >
              <CodeSurfer
                code={codeBottom}
                step={currentStepBottom}
                showNumbers={showNumbers}
              />
            </div>
            <div style={{ height: "25px" }} />
          </div>
        );
      }
    }
  )
);
