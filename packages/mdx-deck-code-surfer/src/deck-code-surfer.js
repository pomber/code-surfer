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
            update(incStep(this.props.steps));
            break;
          case "ArrowUp":
            e.preventDefault();
            update(decStep());
            break;
        }
      };

      render() {
        const { code, steps, title, notes, ...rest } = this.props;
        const { step, mode } = this.props.deck;
        const currentStep = step < 0 ? { notes } : steps[step] || steps[0];
        const isOverview = mode === modes.overview;

        const stepTitle = currentStep.title || title;
        const anyNotes = notes || steps.some(s => s.notes);

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
              <CodeSurfer code={code} step={currentStep} {...rest} />
            </div>
            {anyNotes && (
              <p style={{ height: "50px" }}>{currentStep.notes || "\u00A0"}</p>
            )}
            <div style={{ height: "35px" }} />
          </div>
        );
      }
    }
  )
);
