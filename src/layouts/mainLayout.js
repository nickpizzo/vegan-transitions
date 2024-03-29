import React, { Component } from "react";

import Header from "./../components/header";
import Footer from "./../components/footer";
// import SideBar from "./../components/sidebar";
import Navigation from "./../components/navigation";

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        {/* <aside className="sideBar">
          <SideBar />
        </aside> */}
        <section className="main">
          <Header />
          <Navigation />
          <div className="grid">{this.props.children}</div>
          <Footer />
        </section>
      </div>
    );
  }
}

export default MainLayout;
