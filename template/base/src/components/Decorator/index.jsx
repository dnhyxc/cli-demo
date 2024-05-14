/*
 * @Description: 装饰组件
 * @Author: dnh
 * @Date: 2022-06-14 17:20:25
 * @LastEditors: dnh
 * @FilePath: \src\components\Decorator\index.tsx
 */
import React, { ReactNode } from "react";
import styles from "./index.scss";

const Decorator = ({ children, className }) => {
  return <div className={ className || styles.container }>{ children }</div>;
};

export default Decorator;
