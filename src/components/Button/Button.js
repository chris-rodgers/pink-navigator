import React from "react";
import styles from "./Button.module.css";

const Button = ({ onClick, children }) => {
    return (<button role="button" tabIndex={0} className={styles.button} onClick={onClick}>{children}</button>)
}

export default Button;