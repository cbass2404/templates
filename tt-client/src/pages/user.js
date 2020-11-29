import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// mui
import Grid from "@material-ui/core/Grid";

// redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";

// components
import Status from "../components/status/status";
import StaticProfile from "../components/profile/staticProfile";

class User extends Component {
  state = {
    profile: null,
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({ profile: res.data.user });
      })
      .catch((err) => console.log("userProfile getUserData", err));
  }
  render() {
    const { status, loading } = this.props.data;

    const statusMarkup = loading ? (
      <p>Loading data...</p>
    ) : status === null ? (
      <p>No status updates from this user</p>
    ) : (
      status.map((status) => <Status key={status.statusId} status={status} />)
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {statusMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <p>Loading profile...</p>
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

User.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getUserData })(User);
