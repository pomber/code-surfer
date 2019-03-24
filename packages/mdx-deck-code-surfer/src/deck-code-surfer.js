import CodeSurfer from "code-surfer";
import React from "react";
import { withContext } from "@mdx-deck/components";
import { withTheme } from "emotion-theming";
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
    const { register, index } = props.context;
    if (typeof register !== "function") return;
    const parsedSteps = this.parseSteps(props.steps);
    register(index, { steps: parsedSteps.length - 1 });
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
      context,
      code,
      steps,
      title,
      notes,
      theme,
      prismTheme,
      showNumbers,
      ...rest
    } = this.props;

    const { step } = context;
    const stepIndex = step || 0;
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
const EnhancedCodeSurfer = withContext(withTheme(InnerCodeSurfer));
export default ({ theme, ...rest }) => (
  <EnhancedCodeSurfer {...rest} prismTheme={theme} />
);
