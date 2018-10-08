import CodeSurfer from "code-surfer";
import React from "react";
import { withDeck, updaters } from "mdx-deck";
import { withTheme } from "styled-components";
import memoizeOne from "memoize-one";

const Notes = ({ notes }) =>
  !notes || typeof notes === "string" ? (
    <p style={{ height: "50px" }}>{notes || "\u00A0"}</p>
  ) : (
    notes()
  );

const Title = ({ title }) =>
  typeof title === "string" ? <h1>{title}</h1> : title();

class InnerCodeSurfer extends React.Component {
  constructor(props) {
    super(props);
    const { update, index } = props.deck;
    const parsedSteps = this.parseSteps(props.steps);
    const maxStep = parsedSteps.length - 1;
    update(updaters.setSteps(index, maxStep));
  }

  shouldComponentUpdate(nextProps) {
    // console.log(nextProps.deck.id, nextProps.deck.active);
    return !!nextProps.deck.active;
  }

  parseSteps = memoizeOne((steps, notes) => {
    if (!steps) {
      return [{ notes }];
    }

    if (typeof steps === "string") {
      return steps
        .trim()
        .split("\n")
        .map(stepAndNoteString => {
          const [step, notes] = stepAndNoteString.split("> ");
          return {
            step,
            notes
          };
        });
    }

    return steps.map(({ notes, title, ...step }) => ({ step, notes, title }));
  });

  render() {
    let {
      code,
      steps,
      title,
      notes,
      theme,
      prismTheme,
      showNumbers,
      ...rest
    } = this.props;

    const stepIndex = this.props.deck.step || 0;
    const mdxDeckTheme = theme;
    prismTheme = prismTheme || mdxDeckTheme.codeSurfer;
    showNumbers = showNumbers || (prismTheme && prismTheme.showNumbers);
    const stepsWithNotes = this.parseSteps(steps, notes);

    const current =
      stepsWithNotes[stepIndex >= stepsWithNotes.length ? 0 : stepIndex];
    const currentStep = current.step;
    const currentTitle = current.title || title;
    const currentNotes = current.notes;
    const anyNotes = stepsWithNotes.some(s => s.notes);

    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          background: prismTheme && prismTheme.plain.backgroundColor,
          color: prismTheme && prismTheme.plain.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          {currentTitle && <Title title={currentTitle} />}
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              overflow: "hidden"
            }}
            key="code"
          >
            <CodeSurfer
              {...rest}
              code={code}
              showNumbers={showNumbers}
              step={currentStep}
              theme={prismTheme}
              monospace={mdxDeckTheme && mdxDeckTheme.monospace}
            />
          </div>
          {anyNotes && <Notes notes={currentNotes} />}
          <div style={{ height: "35px" }} />
        </div>
      </div>
    );
  }
}

// Things I need to do to avoid props name collisions
const EnhancedCodeSurfer = withDeck(withTheme(InnerCodeSurfer));
export default ({ theme, ...rest }) => (
  <EnhancedCodeSurfer {...rest} prismTheme={theme} />
);
