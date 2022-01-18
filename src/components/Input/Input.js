import React from "react";
import styles from "../Select/Select.module.css";

const Input = (props) => {
    // console.log(value)
    return (<input className={styles.input} {...props} />)
}

export default Input;