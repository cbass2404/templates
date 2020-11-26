import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import Status from "../components/status";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
    };
  }

  getStatus = () => {
    axios
      .get("/status")
      .then((res) => {
        this.setState({
          status: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getStatus();
  }

  componentWillUnmount() {}

  render() {
    let recentStatusMarkup = this.state.status ? (
      this.state.status.map((oneStatus) => (
        <Status key={oneStatus.statusId} oneStatus={oneStatus} />
      ))
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentStatusMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile...</p>
        </Grid>
      </Grid>
    );
  }
}

export default Home;
