import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../services/api.js';
import { useHistory } from 'react-router-dom';
import { login } from '../../context/authSlice.js';

// center
const loginFormLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

const validateMessages = {
  /* eslint-disable no-template-curly-in-string */
  required: '${label} is required!',
  /* eslint-enable no-template-curly-in-string */
};

function Login() {
  const history = useHistory();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const submitForm = async () => {
    const {username, password} = await form.validateFields();
    const userInfo = await userLogin(username, password);
    if (userInfo) {
      dispatch(login(userInfo));
      history.push('/');

    } else {
      message.error('Authentication failed');
    }
  };

  return (
    <Form {...loginFormLayout} form={form} validateMessages={validateMessages}>
      <Form.Item name='username' label='Username' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name='password' label='Password' rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8 }}>
        <Button type='primary' onClick={submitForm}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
