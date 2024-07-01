import React, { Fragment } from "react";
import Sidebar from "../Sidebar";

const Layout = (props) => {
  return (
    <div className="main_layout" >
      <Sidebar />
      <div className="main_wrapper">{props.children}</div>
    </div>
  );
};

export default Layout;
