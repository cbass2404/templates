import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { getStatus } from "../redux/actions/dataActions";

// components
import Status from "../components/status/status";
import Profile from "../components/profile/profile";

class Home extends Component {
  componentDidMount() {
    this.props.getStatus();
  }

  render() {
    const { status, loading } = this.props.data;
    let recentStatusMarkup = status ? (
      status.map((status) => <Status key={status.statusId} status={status} />)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentStatusMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  getStatus: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getStatus })(Home);
