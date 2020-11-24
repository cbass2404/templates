import React, { Component } from "react";
import axios from "axios";

import Grid from "@material-ui/core/Grid";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
    };
  }

  componentDidMount() {
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
  }

  render() {
    let recentStatusMarkup = this.state.status ? (
      this.status.status.map((oneStatus) => <p>{oneStatus.body}</p>)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={16}>
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
