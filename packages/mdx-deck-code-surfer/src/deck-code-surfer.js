import CodeSurfer from "code-surfer";
import React from "react";
import { withDeck, updaters } from "mdx-deck";

export default withDeck(
  class InnerCodeSurfer extends React.Component {
    constructor(props) {
      super(props);
      const { update, index } = props.deck;
      const steps = props.steps ? props.steps.length : 0;
      update(updaters.setSteps(index, steps));
    }

    shouldComponentUpdate(nextProps) {
      return nextProps.deck.active;
    }

    render() {
      const { code, steps, title, notes, theme, ...rest } = this.props;
      const { step } = this.props.deck;

      const stepZero = {
        range: [0, code.split("\n").length],
        notes
      };

      const currentStep =
        !steps || step < 1 ? stepZero : steps[step - 1] || steps[0];
      // console.log(title);
      // console.log("step:", step);

      const stepTitle = currentStep.title || title;
      const anyNotes = notes || steps.some(s => s.notes);

      return (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            background: theme && theme.plain.backgroundColor,
            color: theme && theme.plain.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
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
                theme={theme}
                {...rest}
              />
            </div>
            {anyNotes && (
              <p style={{ height: "50px" }}>{currentStep.notes || "\u00A0"}</p>
            )}
            <div style={{ height: "35px" }} />
          </div>
        </div>
      );
    }
  }
);
