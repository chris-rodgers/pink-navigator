import React from "react";
import styles from "./styles.module.css";
import questions from "./questions.json";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";

const optionValues = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree"
};

export default function App() {
  const [state, setState] = React.useState(questions);
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

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Life stage measurements for Repetitive paralysis cycle.
      </div>
      {/* <div className={styles.scale}>
        <div>
          <span>1</span>Strongly Disagree{" "}
        </div>
        <div>
          <span>2</span>Disagree{" "}
        </div>
        <div>
          <span>3</span>Neither{" "}
        </div>
        <div>
          <span>4</span>Agree{" "}
        </div>
        <div>
          <span>5</span>Strongly Agree
        </div>
      </div> */}
      {Object.keys(state).map((section, i) => {
        const questions = state[section];
        return (
          <div key={i}>
            <div className={styles.subtitle}>{section}</div>
            {Object.keys(questions).map((key) => {
              return (
                <div className={styles.row} key={key}>
                  <div>{key}</div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={questions[key] ? questions[key].value : undefined}
                    onChange={(e) => {
                      setState((newState) => {
                        // console.log("change", e.target.value);
                        const newValue = Number(e.target.value);

                        newState[section][key].value = Math.min(newValue, 5);
                        return { ...newState };
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
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
    </div>
  );
}
