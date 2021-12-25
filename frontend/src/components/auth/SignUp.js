import { Form, Input, Button, message } from 'antd';
import { userSignUp } from '../../services/api.js';

// center
const signupFormLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

const validateMessages = {
  /* eslint-disable no-template-curly-in-string */
  required: '${label} is required!',
  /* eslint-enable no-template-curly-in-string */
  types: {
    email: 'invalid email!',
  },
};

function SignUp() {
  const [form] = Form.useForm();
  const submitForm = async () => {
    const {username, password, email} = await form.validateFields();
    const res = await userSignUp(username, password, email);
    if (res.isSuccess) {
      message.success(res.message)
    } else {
      message.error(res.message)
    }
  };

  return (
    <Form {...signupFormLayout} form={form} validateMessages={validateMessages}>
      <Form.Item name='username' label='Username' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name='password' label='Password' rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item name='email' label='Email' rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8 }}>
        <Button type='primary' onClick={submitForm}>
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignUp;
