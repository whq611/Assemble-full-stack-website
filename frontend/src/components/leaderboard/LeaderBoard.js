import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getLeaderboardUsers } from '../../services/api.js';
import { Table } from "antd";

import Grow from "@mui/material/Grow";

function LeaderBoard() {
  const [userInfos, setUserInfos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userInfos = await getLeaderboardUsers();
      setUserInfos(userInfos);
    };
    fetchData();
  }, []);

  const data = userInfos.map(({username,id,subscriberCount}) => (
    {
      key:id,
      userinfo:{username, id},
      subscriberCount:subscriberCount,
    }
  )
  );

  const columns = [
    {
      title: 'User',
      dataIndex: 'userinfo',
      key: 'userinfo',
      render: ({username,id}) => (<NavLink to={`/profile/${id}`}> {username} </NavLink>),
    },
    {
      title: 'Subscriber',
      dataIndex: 'subscriberCount',
      key: 'subscriberCount',
    },
  ];

  return (
    <Grow in>
      <div className="container">
        <h2> LeaderBoard </h2>
        <Table
          dataSource={data}
          columns={columns}
          bordered
          pagination={false}
          size={"small"}
        />
      </div>
    </Grow>
  );
}

export default LeaderBoard;
