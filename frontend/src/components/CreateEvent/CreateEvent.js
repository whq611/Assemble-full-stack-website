import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  message,
} from "antd";
import {
  createEvent,
  getActivities,
  sendEmailToSubscribers,
} from "../../services/api.js";
import React, { useState, useEffect } from "react";

import Grow from "@mui/material/Grow";
import CircularProgress from "@mui/material/CircularProgress";

const validateMessages = {
  /* eslint-disable no-template-curly-in-string */
  required: "${label} is required!",
  /* eslint-enable no-template-curly-in-string */
};

const createEventFormLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
  layout: "horizontal",
  colon: false,
};

function CreateEvent() {
  const [activities, setActivities] = useState(null);
  const [form] = Form.useForm();

  const submitForm = async () => {
    const data = await form.validateFields();

    const eventDateTime =
      data.eventDate.format("YYYY-MM-DD") +
      " " +
      data.eventTime.format("HH:mm:ss");
    const response = await createEvent(
      data.activityId,
      data.eventName,
      data.eventDescription,
      eventDateTime,
      data.participantLimit
    );
    message.success("Successfully created event");
    await sendEmailToSubscribers(response.data.eventId, "onCreate");
  };

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
        <Form
          {...createEventFormLayout}
          form={form}
          validateMessages={validateMessages}
        >
          <Form.Item
            name="eventName"
            label="Event Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="eventDescription"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>

          <Form.Item
            name="activityId"
            label="Activity Type"
            rules={[{ required: true }]}
          >
            <Select>
              {activities.map(({ name, id }) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="eventDate"
            label="Event Date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="eventTime"
            label="Event Time"
            rules={[{ required: true }]}
          >
            <TimePicker format={"HH:mm"} />
          </Form.Item>

          <Form.Item
            name="participantLimit"
            label="Participant Limit"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Button type="primary" onClick={submitForm}>
              Create Event!
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Grow>
  );
}

export default CreateEvent;
