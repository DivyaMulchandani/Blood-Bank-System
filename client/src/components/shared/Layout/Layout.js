import React from "react";
import Header from "./Header";
import SlideBar from "./SlideBar";

const Layout = ({ children }) => {
  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div className="row g-0">
        <div className="col-md-2">
          <SlideBar />
        </div>
        <div className="content col-md-10">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
