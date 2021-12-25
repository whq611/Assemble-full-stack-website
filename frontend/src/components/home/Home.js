import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Input, Select, Card, Col, Row, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./home.css";
import { searchEvent, getActivities, getTrendingEvents } from "../../services/api.js";
import { FireTwoTone } from "@ant-design/icons";
import CircularProgress from "@mui/material/CircularProgress";

import Grow from "@mui/material/Grow";


function Emoji({ className, label, symbol }) {
  return (
    <span className={className} role="img" aria-label={label}>
      {String.fromCodePoint(symbol)}
    </span>
  );
}

function ActivityOption({activity, rank}) {
  const topEmojis = [0x1f947, 0x1f948, 0x1f949];
  return rank < topEmojis.length ? (
    <span>
      <Emoji symbol={topEmojis[rank]} />
      {activity}
    </span>
  ) : (
    activity
  );
}

function summarizeDescrption(description) {
  const maxChars = 100;
  return (description.length < maxChars)
    ? description
    : description.slice(0, maxChars) + '......';
}

function getMultiFireIcon(count) {
  return (
    <div>
      { [...Array(count).keys()].map(_ => <FireTwoTone />) }
    </div>
  );
}

function getPopularityIcon(status) {
  switch (status) {
    case 'Hot': return getMultiFireIcon(1);
    case 'Fire': return getMultiFireIcon(2);
    case 'Boom': return getMultiFireIcon(3);
    default:
      return null;
  }
}

function EventCard({id, name, description, popularityStatus}) {
  const icon = getPopularityIcon(popularityStatus);
  const titleWithPopularityIcon = <div> {icon} {name} </div>;
  return (
    <Card
      title={titleWithPopularityIcon}
      extra={<NavLink to={`/event/${id}`}>Details</NavLink>}
      align="center"
    >
      {summarizeDescrption(description)}
    </Card>
  );
}

function Home() {
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [activities, setActivities] = useState(null);
  const [activityId, setActivityId] = useState(-1);

  const searchAndSetEvents = async () => {
    const events = (activityId === -1)
      ? await searchEvent(query)
      : await searchEvent(query, { activityId });
    // console.log(res.data);
    setEvents(events);
  };

  const getTrendingAndSetEvents = async () => {
    const events = await getTrendingEvents();
    setEvents(events);
  };

  const updateActivityId = (activityId) => {
    // console.log(activityId);
    setActivityId(activityId);
  };

  const updateQuery = (e) => {
    setQuery(e.target.value);
  } 

  useEffect(() => {
    async function getAndSetActivities() {
      const activities = await getActivities();
      setActivities(activities);
    }
    getAndSetActivities();
  }, []);

  if (activities === null) {
    return <CircularProgress color="secondary" />;
  }

  return (
    <Grow in>
      <div>
        <h1 align="center"> Search For Events</h1>

        <Input
          className="center"
          size="large"
          style={{ width: "50%" }}
          placeholder="Search for a event like Werewolves (狼人杀)"
          onChange={updateQuery}
          prefix={<SearchOutlined />}
        />
        <br />

        <Select
          showSearch
          className="center"
          style={{ width: "50%" }}
          placeholder="Select type of activities to search; Default is any activities"
          optionFilterProp="children"
          onChange={updateActivityId}
        >
          <Select.Option key={-1} value={-1}>
            Any
          </Select.Option>
          {activities.map(({ name, id }, idx) => (
            <Select.Option key={id} value={id}>
              <ActivityOption activity={name} rank={idx} />
            </Select.Option>
          ))}
        </Select>
        <br />

        <Button
          type="primary"
          className="center"
          style={{ width: "30%" }}
          size="large"
          shape="round"
          onClick={searchAndSetEvents}
        >
          Search!
        </Button>

        <br />

        <Button
          type="primary"
          className="center"
          style={{ width: "30%", "margin-top": "16px" }}
          size="large"
          shape="round"
          onClick={getTrendingAndSetEvents}
        >
          What's trending?
        </Button>

        <Row gutter={[32, 32]} justify="space-around">
          {events.map((eventInfo) => (
            <Col key={eventInfo.id} span={7}>
              <EventCard {...eventInfo} />
            </Col>
          ))}
        </Row>
      </div>
    </Grow>
  );
}

export default Home;
