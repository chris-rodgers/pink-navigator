import React from "react";
import styles from "./Checkbox.module.css";
import classnames from "classnames";

const Checkbox = ({ checked, onClick, disabled, label }) => {
    return <div className={classnames(styles.container, styles[`container--checkbox`], { [styles[`container--disabled`]]: disabled })} onClick={disabled ? undefined : onClick}>
        <CheckboxIcon checked={checked} />
        {label}
    </div>
}

export const CheckboxIcon = ({ checked }) => {
    return (<div className={classnames(styles.checkbox, { [styles['checkbox--checked']]: checked })}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>)
}

export default Checkbox;