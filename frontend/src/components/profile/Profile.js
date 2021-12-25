import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { selectUserInfo } from "../../context/authSlice.js";
import { selectAuthState } from "../../context/store.js";
import {
  getProfileInfo,
  updateProfileInfo,
  subscribe,
  unsubscribe,
} from "../../services/api.js";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import "./profile.css";

import Grow from "@mui/material/Grow";
import CircularProgress from "@mui/material/CircularProgress";

function BadgeDisplay({ badgeInfos }) {
  if (badgeInfos.length === 0) {
    return null;
  }
  return (
    <div>
      {badgeInfos.map(({ id, name }) => (
        <img
          alt={name}
          title={name}
          style={{ height: "100px", width: "auto" }}
          src={`/badges/${id}.png`}
        />
      ))}
      <br />
      <br />
    </div>
  );
}

function UpdatableRow({ label, initValue, onFinalizedUpdate }) {
  const [value, setValue] = useState(initValue);
  return (
    <div>
      <label> {label} </label>
      <input
        className="input"
        type="text"
        defaultValue={initValue}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="button"
        type="button"
        onClick={() => onFinalizedUpdate(value)}
      >
        Update
      </button>
    </div>
  );
}

// Input: [{ username: string, id: number } ...]
function UserInfoList({ userInfos }) {
  return (
    <ListGroup>
      {userInfos.map(({ username, id }) => (
        <ListGroup.Item key={id}>
          <NavLink to={`/profile/${id}`}> {username} </NavLink>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

// Input: [{ name: string, id: number } ...]
function EventInfoList({ eventInfos }) {
  return (
    <ListGroup>
      {eventInfos.map(({ name, id }) => (
        <ListGroup.Item key={id}>
          <NavLink to={`/event/${id}`}> {name} </NavLink>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

function SubscriptionButton({ subscribable, onSubscribe, onUnsubscribe }) {
  if (subscribable) {
    return (
      <button className="button" onClick={onSubscribe}>
        {" "}
        Subscribe{" "}
      </button>
    );
  } else {
    return (
      <button className="button" onClick={onUnsubscribe}>
        {" "}
        Unsubscribe{" "}
      </button>
    );
  }
}

function Profile() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const userInfoStore = selectUserInfo(useSelector(selectAuthState));

  const fetchAndSetInfo = useCallback(async () => {
    const userInfo = await getProfileInfo(id);
    setUserInfo(userInfo);
  }, [id]);

  const onEmailUpdate = async (newEmail) => {
    await updateProfileInfo(id, { email: newEmail });
    fetchAndSetInfo();
  };

  const onSubscribe = async () => {
    await subscribe(id);
    fetchAndSetInfo();
  };

  const onUnsubscribe = async () => {
    await unsubscribe(id);
    fetchAndSetInfo();
  };

  useEffect(() => {
    fetchAndSetInfo();
  }, [fetchAndSetInfo]); // force update when clicking subscribe(r/e) user link

  if (userInfo === null) {
    return <CircularProgress color="secondary" />;
  }
  const {
    username,
    reputationPoints,
    subscribers,
    subscribees,
    participatedEvents,
    badges,
  } = userInfo;
  const privateUserInfo = userInfo.privateInfo;

  return (
    <Grow in>
      <div className="profile">
        <h2 className="headline"> {username} </h2>

        <Container>
          <Row>
            <Col xs={4}>
              {/* <h2 className="headline"> {username} </h2> */}
              <BadgeDisplay badgeInfos={badges} />
              <div> Reputation points = {reputationPoints} </div>
              <br />

              {userInfoStore && userInfoStore.id === id && (
                <div>
                  <UpdatableRow
                    label="Email"
                    initValue={privateUserInfo.email}
                    onFinalizedUpdate={onEmailUpdate}
                  />
                </div>
              )}

              {userInfoStore && userInfoStore.id !== id && (
                <SubscriptionButton
                  subscribable={privateUserInfo.subscribable}
                  onSubscribe={onSubscribe}
                  onUnsubscribe={onUnsubscribe}
                />
              )}
            </Col>

            <Col>
              <h4> Subscribers </h4>
              <UserInfoList userInfos={subscribers} />
            </Col>

            <Col>
              <h4> Subscribees </h4>
              <UserInfoList userInfos={subscribees} />
            </Col>

            <Col>
              <h4> Participated Events </h4>
              <EventInfoList eventInfos={participatedEvents} />
            </Col>
          </Row>
        </Container>
      </div>
    </Grow>
  );
}

export default Profile;
