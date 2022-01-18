import React from "react";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";
import styles from "./styles.module.css";
import questions from "./questions.json";
import personalDetails from "./personal-details.json";
import contactDetails from "./contact-details.json";

import Checkbox from "./components/Checkbox/Checkbox";
import Button from "./components/Button/Button";
import Select from "./components/Select/Select";
import Input from "./components/Input/Input";

const optionValues = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neither Agree/ Disagree",
  4: "Agree",
  5: "Strongly Agree",
};

const alpha = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export default function App() {
  const [state, setState] = React.useState(questions);
  const [shouldSubmit, setShouldSubmit] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const isFinished = page === 3;
  const [contactDetailsState, setContactDetailsState] = React.useState(contactDetails);
  const [personalDetailsState, setPersonalDetailsState] = React.useState(personalDetails);
  const [emailConsent, setEmailConsent] = React.useState(false)

  React.useEffect(() => {
    document.getElementById("pink-navigator-root").scrollIntoView(true);
  }, [page]);

  const { data, captions } = React.useMemo(() => {
    const res = {
      data: {},
      meta: { color: "pink" },
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

  // console.log(data);

  const handleSubmit = () => {
    const body = new FormData();
    const questionValues = {};
    
    if(emailConsent){
      Object.keys(contactDetailsState).forEach((key) => {
        body.append(key, contactDetailsState[key].value);
      });
    }
    Object.keys(personalDetailsState).forEach((key) => {
      body.append(key, personalDetailsState[key].value);
    });
    // Questions
    Object.values(state).forEach((section, si) => {
      Object.keys(section).forEach((key, i) => {
        const questionValueKey = `${si + 1}${alpha[i]}`;
        body.append(questionValueKey, section[key].value);
        questionValues[questionValueKey] = `${questionValueKey}. ${key}`;
      });
    });
    // console.log(Object.keys(Object.fromEntries(body)), questionValues)
    fetch(
      "https://script.google.com/macros/s/AKfycbzn7uelFFvDkMmP9Dk3UXruYog39DhEpnlC5X4iAOgoGM85jdtiU36LzpWkApavfZhi/exec",
      { method: "POST", body }
    )
      .then((response) => {
        setHasSubmitted(true);
        console.log("Success!", response);
      })
      .catch((error) => console.error("Error!", error.message));
  };

  const handlePrev = () => {
    setPage(page - 1);
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  React.useEffect(() => {
    if (isFinished && shouldSubmit && !hasSubmitted) {
      handleSubmit();
    }
  }, [isFinished, shouldSubmit]);

  // const shouldShowCheckbox = !isFinished || !shouldSubmit;

  return (
    <div className={styles.container}>
      {/* <div className={styles.title}>
        Life stage measurements for Repetitive paralysis cycle.
      </div> */}
      {
        [
          <div style={{ marginTop: 10, marginBottom: 20 }}>
            {Object.keys(contactDetailsState).map((key) => {
              const { title,...rest } = contactDetailsState[key];
              return (
                <div key={key}>
                  <label className={styles.label} htmlFor={key}>
                    {title}
                  </label>
                  <div>
                    <Input
                      id={key}
                      onChange={(e) => {
                        setContactDetailsState((prevContactDetailsState) => {
                          const nextContactDetialsState = {
                            ...prevContactDetailsState,
                          };
                          nextContactDetialsState[key].value = e.target.value;
                          return nextContactDetialsState;
                        });
                      }}
                      {...rest}
                    />
                  </div>
                </div>
              );
            })}
            <Checkbox onClick={() => { setEmailConsent(!emailConsent) }} checked={emailConsent} label={"Allow Across Rainbows to contact me about my results"} />
          </div>,
          <div style={{ marginTop: 10 }}>
            {Object.keys(personalDetailsState).map((key) => {
              const detail = personalDetailsState[key];
              return (
                <div key={key}>
                  <label className={styles.label} htmlFor={key}>
                    {detail.title}
                  </label>
                  <div>
                    <Select
                      id={key}
                      custom={detail.custom}
                      value={detail.value}
                      options={detail.options}
                      onChange={(e) => {
                        setPersonalDetailsState((prevPersonalDetailsState) => {
                          const nextPersonalDetialsState = {
                            ...prevPersonalDetailsState,
                          };
                          nextPersonalDetialsState[key].value = e.target.value;
                          return nextPersonalDetialsState;
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>,
          <div>
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

                                newState[section][key].value = Math.min(
                                  newValue,
                                  5
                                );
                                return { ...newState };
                              });
                            }}
                          />
                          <div className={styles.caption}>
                            {optionValues[questions[key]?.value]}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>,
          <div>
            <div className={styles.title}>Result - How did you do?</div>
            <div className={styles["results-wrapper"]}>
              <div className={styles.chart}>
                <RadarChart
                  options={{
                    captionMargin: 50,
                    captionProps: () => ({
                      fontSize: 20,
                      textAnchor: "middle",
                    }),
                  }}
                  captions={captions}
                  data={data}
                  size={450}
                />
              </div>
              <div className={styles.results}>
                {Object.keys(data[0].data).map((key) => {
                  return (
                    <div className={styles.result}>
                      <div className={styles["result-inner"]}>
                        <div className={styles.subtitle}>{key}</div>
                        <div className={styles.score}>
                          {(data[0].data[key] * 10).toFixed()}/10
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.summary}>
                <p>
                  <strong>If you scored between 0 – 3:</strong> Oh No! You are
                  quite stuck. Your feelings and beliefs about the past are
                  keeping you stuck, and it may be limiting your happiness in
                  the present. When you want to get unstuck and start living a
                  life that you’ll love, you must change your inner world first.
                </p>
                <p>
                  <strong>If you scored between 4 – 7:</strong> Not bad! but be
                  careful because sometimes it may feel like you are moving and
                  getting somewhere, when, in reality, you are coasting.{" "}
                </p>
                <p>
                  <strong>If you scored between 8 – 10:</strong>{" "}
                  Congratulations! You’ve got this. You are doing exceptionally
                  well.{" "}
                </p>
              </div>
            </div>
          </div>,
        ][page]
      }
      <div className={styles.footer}>
        <div className={styles.buttons}>
          {!isFinished && page ? (
            <Button onClick={handlePrev}>← Previous</Button>
          ) : null}
          {!isFinished ? (
            <Button onClick={handleNext}>{page === 2 ? "Finish" : "Next"} →</Button>
          ) : null}
        </div>
        {/* <Checkbox onClick={() => { setShouldSubmit(!shouldSubmit) }} disabled={!shouldShowCheckbox} checked={shouldSubmit} label={shouldShowCheckbox ? "Record my answers" : hasSubmitted ? "We've recorded your answers" : "Submitting..."} /> */}
      </div>
    </div>
  );
}
