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
import StatusSkeleton from "../utility/statusSkeleton";
import ProfileSkeleton from "../utility/profileSkeleton";

class User extends Component {
  state = {
    profile: null,
    statusIdParam: null,
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    const statusId = this.props.match.params.statusId;

    if (statusId) this.setState({ statusIdParam: statusId });

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
    const { statusIdParam } = this.state;

    const statusMarkup = loading ? (
      <StatusSkeleton />
    ) : status === null ? (
      <p>No status updates from this user</p>
    ) : !statusIdParam ? (
      status.map((status) => <Status key={status.statusId} status={status} />)
    ) : (
      status.map((status) => {
        if (status.statusId !== statusIdParam)
          return <Status key={status.statusId} status={status} />;
        else return <Status key={status.statusId} status={status} openDialog />;
      })
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {statusMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <ProfileSkeleton />
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
