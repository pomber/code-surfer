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
        const { code, steps } = this.props;
        const { step, mode } = this.props.deck;
        const currentStep = step < 0 ? {} : steps[step];
        const isOverview = mode === modes.overview;
        return <CodeSurfer code={code} step={currentStep} />;
      }
    }
  )
);
