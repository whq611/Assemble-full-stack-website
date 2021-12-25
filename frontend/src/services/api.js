import { message } from "antd";
import axios from "axios";
import emailjs from "emailjs-com";
import {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  authTokenToUserInfo,
} from "../context/session.js";

const apiPrefix = "http://localhost:3001";

async function get(path, params = {}, token = "") {
  const headers = token === "" ? {} : { token };
  return axios.get(apiPrefix + path, { params, headers });
}

async function post(path, data = {}, token = "") {
  const headers = token === "" ? {} : { token };
  return axios.post(apiPrefix + path, data, { headers });
}

async function del(path, data = {}, token = "") {
  const headers = token === "" ? {} : { token };
  return axios.delete(apiPrefix + path, { data, headers });
}

// return { isSuccess: bool, message: str }
export async function userSignUp(username, password, email) {
  try {
    const { data } = await post("/signup", { username, password, email });
    return data;
  } catch (err) {
    if (err.response.status === 400) {
      return err.response.data;
    } else {
      return { isSuccess: false, message: "Unknown server error" };
    }
  }
}

// return null || userInfo object
export async function userLogin(username, password) {
  try {
    const { data } = await post("/login", { username, password });
    const { token } = data;
    setAuthToken(token);
    return authTokenToUserInfo(token);
  } catch (err) {
    console.log(err);
    if (err.response.status === 400) {
      return null;
    } else {
      // TODO backend issue, redirect to home page or sth.
      throw err;
    }
  }
}

export async function userLogout() {
  // TODO contact backend to clear auth token
  clearAuthToken();
}

// See backend endpoint doc for what data is returned
export async function getProfileInfo(userId) {
  try {
    const { data } = await get(`/profile/${userId}`, {}, getAuthToken());
    return data;
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

/**
 * Updatable info:
 * - email: string
 */
export async function updateProfileInfo(userId, newInfo) {
  try {
    await post(`/profile/${userId}`, newInfo, getAuthToken());
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

export async function subscribe(subscribeeId) {
  try {
    await post(`/subscribe`, { subscribeeId }, getAuthToken());
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

export async function unsubscribe(subscribeeId) {
  try {
    await del(`/subscribe`, { subscribeeId }, getAuthToken());
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

export async function searchEvent(keyword, filterOptions) {
  try {
    const queryParams = { keyword: keyword, ...filterOptions };
    const { data } = await get("/search", queryParams);
    return data;
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

export async function getEventInfo(eventId) {
  try {
    const { data } = await get(`/event/${eventId}`, {}, getAuthToken());
    return data;
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

export async function createEvent(
  activityId,
  eventName,
  eventDescription,
  eventDateTime,
  participantLimit
) {
  try {
    const data = {
      activityId,
      eventName,
      eventDescription,
      eventDateTime,
      participantLimit,
    };
    const response = await post("/event", data, getAuthToken());
    return response;
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

export async function joinEvent(eventId) {
  try {
    await post(`/event-participation/${eventId}`, {}, getAuthToken());
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

export async function unjoinEvent(eventId) {
  try {
    await del(`/event-participation/${eventId}`, {}, getAuthToken());
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

export async function getActivities() {
  try {
    const { data } = await get("/activities");
    return data;
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

export async function getLeaderboardUsers() {
  try {
    const { data } = await get("/leaderboard");
    return data;
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

export async function getTrendingEvents() {
  try {
    const { data } = await get("/trending-events");
    return data;
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}

export async function sendEmailToSubscribers(eventId, emailType) {
  try {
    const userInfo = await get(`/profile/${getAuthToken()}`, {}, getAuthToken());

    console.log(userInfo);
    const subscriberInfo = userInfo.data.subscribers;

    for (const { username, email } of subscriberInfo) {
      const sendData = {
        to_email: email,
        from_email: "assemble.no.reply@gmail.com",
        to_name: username,
        from_name: userInfo.data.username,
        event_id: eventId,
      };

      let template_id = "";
      if (emailType === "onJoin") {
        template_id = "template_z1ttrn6";
      } else {
        template_id = "template_1n02fg7";
      }

      // Should probably hide the service id and user_id in a setting.
      emailjs
        .send(
          "service_6jkw4l7",
          template_id,
          sendData,
          "user_LdMNDGOs2EF5FtqALaDKP"
        )
        .then(
          function (response) {
            console.log("SUCCESS in send email to ", email);
          },
          function (error) {
            console.log("FAILED...", error);
          }
        );
    }
  } catch (err) {
    // TODO backend issue, redirect to home page or sth.
    throw err;
  }
}
