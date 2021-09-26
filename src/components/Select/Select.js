import React from "react";
import styles from "./Select.module.css";

const Select = ({ onChange, custom, value = "please-select", options }) => {
    // console.log(value)
    return (<div className={styles.container}>
        <select className={styles.select} onChange={onChange} value={["please-select", ...options].includes(value) ? value : ''}>
            <option value="please-select" disabled>Please Select</option>
            {options.map(option => <option value={option}>{option}</option>)}
            {custom ? <option value="">{custom}</option> : null}
        </select>
        {value == "" || !["please-select", ...options].includes(value) ? <input placeholder="Please enter custom value" className={styles.input} type="text" value={value} onChange={onChange} /> : null}
    </div >)
}

export default Select;