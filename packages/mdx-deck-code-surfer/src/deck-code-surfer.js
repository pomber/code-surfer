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
        const { update } = { index: 0 };
      }

      componentWillUnmount() {
        document.body.removeEventListener("keydown", this.handleKeyDown);
      }

      handleKeyDown = e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (this.props.deck.index !== this.props.slide.index) return;
        const { update } = this.props.deck;
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            update(incStep(this.props.steps));
            break;
          case "ArrowUp":
            e.preventDefault();
            update(decStep());
            break;
        }
      };

      render() {
        const { code, steps, title, showNumbers } = this.props;
        const { step, mode } = this.props.deck;
        const currentStep = step < 0 ? {} : steps[step];
        const isOverview = mode === modes.overview;

        const stepTitle = currentStep.title || title;
        const anyNotes = steps.some(s => s.notes);
        console.log(anyNotes);

        return (
          <div
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {stepTitle && <h1>{stepTitle}</h1>}
            <div style={{ flex: 1, overflow: "hidden" }} key="code">
              <CodeSurfer
                code={code}
                step={currentStep}
                showNumbers={showNumbers}
              />
            </div>
            {anyNotes && <p>{currentStep.notes || "\u00A0"}</p>}
            <div style={{ height: "25px" }} />
          </div>
        );
      }
    }
  )
);
