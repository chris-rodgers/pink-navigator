import React from "react";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";
import styles from "./styles.module.css";
import questions from "./questions.json";
import Checkbox from "./components/Checkbox/Checkbox";
import Button from "./components/Button/Button";

const optionValues = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neither Agree/ Disagree",
  4: "Agree",
  5: "Strongly Agree"
};

const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

export default function App() {
  const [state, setState] = React.useState(questions);
  const [shouldSubmit, setShouldSubmit] = React.useState(true);
  const [isFinished, setIsFinished] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  const { data, captions } = React.useMemo(() => {
    const res = {
      data: {},
      meta: { color: "pink" }
    };
    const captions = {};
    Object.keys(state).forEach((section) => {
      const total = Object.values(state[section]).reduce((prev, curr) => {
        // If the question is negative, then should flip e.g 5 => 1, 4 => 2 etc
        let newValue = curr.value;

        if (curr.sentiment == "negative") {
          newValue = [5, 4, 3, 2, 1].indexOf(newValue) + 1;
        }

        return prev + newValue;
      }, 0);
      const totalPossible = Object.keys(state[section]).length * 5;
      const percentage = total / totalPossible;
      res.data[section] = percentage;
      captions[section] = section;
    });
    return { data: [res], captions };
  }, [state]);

  console.log(data);

  const handleSubmit = () => {
    const body = new FormData();
    const questionValues = {};
    Object.values(state).forEach((section, si) => {
      Object.keys(section).forEach((key, i) => {
        const questionValueKey = `${si + 1}${alpha[i]}`
        body.append(questionValueKey, section[key].value);
        questionValues[questionValueKey] = `${questionValueKey}. ${key}`;
      })
    })
    console.log(body, questionValues)
    fetch('https://script.google.com/macros/s/AKfycbzn7uelFFvDkMmP9Dk3UXruYog39DhEpnlC5X4iAOgoGM85jdtiU36LzpWkApavfZhi/exec', { method: 'POST', body })
      .then(response => { setHasSubmitted(true); console.log('Success!', response) })
      .catch(error => console.error('Error!', error.message))
  }

  const handleFinished = () => {
    setIsFinished(true);
  }

  React.useEffect(() => {
    if (isFinished && shouldSubmit && !hasSubmitted) {
      handleSubmit();
    }
  }, [isFinished, shouldSubmit]);

  const shouldShowCheckbox = !isFinished || !shouldSubmit;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Life stage measurements for Repetitive paralysis cycle.
      </div>
      {!isFinished ? <div>
        {Object.keys(state).map((section, i) => {
          const questions = state[section];
          return (
            <div key={i} className={styles.section}>
              <div className={styles.subtitle}>{section}</div>
              {Object.keys(questions).map((key) => {
                return (
                  <div className={styles.row} key={key}>
                    <div className={styles.left}>{key}</div>
                    <div className={styles.right}>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={questions[key]?.value || undefined}
                        onChange={(e) => {
                          setState((newState) => {
                            // console.log("change", e.target.value);
                            const newValue = Number(e.target.value);

                            newState[section][key].value = Math.min(newValue, 5);
                            return { ...newState };
                          });
                        }}
                      />
                      <div className={styles.caption}>{optionValues[questions[key]?.value]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div className={styles.footer}>
          <Button onClick={handleFinished}>Submit Answers</Button>
        </div>
      </div> :
        <div>
          <div className={styles.subtitle}>Result</div>
          <div className={styles.result}>
            <RadarChart
              options={{
                captionMargin: 50,
                captionProps: () => ({ fontSize: 20, textAnchor: "middle" })
              }}
              captions={captions}
              data={data}
              size={450}
            />
          </div>
        </div>}
      <div className={styles.footer}>
        <Checkbox onClick={() => { setShouldSubmit(!shouldSubmit) }} disabled={!shouldShowCheckbox} checked={shouldSubmit} label={shouldShowCheckbox ? "Record my answers" : hasSubmitted ? "We've recorded your answers" : "Submitting..."} />
      </div>
    </div >
  );
}
