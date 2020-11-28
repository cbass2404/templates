import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MyButton from "../utility/myButton";
import PropTypes from "prop-types";

// MUI Stuff
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

// icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

// redux
import { connect } from "react-redux";
import { likeStatus, unlikeStatus } from "../redux/actions/dataActions";

// component
import DeleteStatus from "./deleteStatus";
import StatusDialog from "./statusDialog.js";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
};

class Status extends Component {
  likedStatus = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.statusId === this.props.status.statusId
      )
    )
      return true;
    else return false;
  };

  likeStatus = () => {
    this.props.likeStatus(this.props.status.statusId);
  };

  unlikeStatus = () => {
    this.props.unlikeStatus(this.props.status.statusId);
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      status: {
        body,
        createdAt,
        userImage,
        userHandle,
        statusId,
        likeCount,
        commentCount,
      },
      user: {
        authenticated,
        credentials: { handle },
      },
    } = this.props;

    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="/login">
          <FavoriteBorder color="primary" />
        </Link>
      </MyButton>
    ) : this.likedStatus() ? (
      <MyButton tip="Undo like" onClick={this.unlikeStatus}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeStatus}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteStatus statusId={statusId} />
      ) : null;

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title="Profile image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          {likeButton}
          <span>{likeCount} Likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
          <StatusDialog statusId={statusId} userHandle={userHandle} />
        </CardContent>
      </Card>
    );
  }
}

Status.propTypes = {
  likeStatus: PropTypes.func.isRequired,
  unlikeStatus: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeStatus,
  unlikeStatus,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Status));
