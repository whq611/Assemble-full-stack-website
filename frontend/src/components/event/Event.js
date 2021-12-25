import { useParams, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getEventInfo,
  joinEvent,
  unjoinEvent,
  sendEmailToSubscribers,
} from "../../services/api.js";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "antd";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { selectUserInfo } from "../../context/authSlice.js";
import { selectAuthState } from "../../context/store.js";
import "./event.css";
import { format } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";

function JoinEventButton({
  canJoin,
  onJoin,
  onUnjoin,
  participantLimit,
  curNumParticipants,
}) {
  if (curNumParticipants === participantLimit) {
    return <Button disabled={true}>Cannot join. Event Full :( </Button>;
  } else if (canJoin) {
    return <Button onClick={onJoin}>Join this event:) </Button>;
  } else {
    return <Button onClick={onUnjoin}>Unjoin this event:( </Button>;
  }
}

// TODO duplicated in Profile.js
// abstract out if we intend the both instances to appear the same
// Input: [{ username: string, id: number } ...]
function UserInfoList({ userInfos }) {
  return (
    <ListGroup horizontal>
      {userInfos.map(({ username, id }) => (
        <ListGroup.Item key={id}>
          <NavLink to={`/profile/${id}`}> {username} </NavLink>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

function parseDateTime(time) {
  return format(new Date(time), "MMMM do, yyyy H:mma");
}

function Event() {
  const { id } = useParams();
  const [eventInfo, setEventInfo] = useState(null);
  const userInfoStore = selectUserInfo(useSelector(selectAuthState));

  const fetchAndSetUserInfo = useCallback(async () => {
    const eventData = await getEventInfo(id);
    setEventInfo(eventData);
  }, [id]);

  const onJoin = async () => {
    await joinEvent(id);
    fetchAndSetUserInfo();
    await sendEmailToSubscribers(id, "onJoin");
  };
  const onUnjoin = async () => {
    await unjoinEvent(id);
    fetchAndSetUserInfo();
  };

  useEffect(() => {
    fetchAndSetUserInfo();
  }, [fetchAndSetUserInfo]);

  if (eventInfo === null) {
    return <CircularProgress color="secondary" />;
  }
  const {
    name,
    username,
    description,
    event_start_time,
    creation_time,
    host_id,
    participant_limit,
    participants,
    privateInfo,
  } = eventInfo;

  return (
    <Container className="eventMessage">
      <Row>
        <Col sm={{ span: 6 }}>
          <p className="title">{name} </p>
          <p>
            Host:{<NavLink to={`/profile/${host_id}`}> {username} </NavLink>}
          </p>
          <p>Date posted: {parseDateTime(creation_time)}</p>
          <p>Event start time: {parseDateTime(event_start_time)}</p>
          <p>Participant Limit: {participant_limit}</p>

          <p className="description">{description}</p>
          {userInfoStore && (
            <JoinEventButton
              canJoin={privateInfo.canJoin}
              onJoin={onJoin}
              onUnjoin={onUnjoin}
              participantLimit={participant_limit}
              curNumParticipants={participants.length}
            />
          )}
        </Col>
        <Col>
          <h3> Participants </h3>
          <UserInfoList userInfos={participants} />
        </Col>
      </Row>
    </Container>
  );
}

export default Event;
