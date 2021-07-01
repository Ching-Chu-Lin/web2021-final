import { Modal, Form, Input, Radio, Button, Checkbox } from "antd";
import { useState } from "react";
import { SAVED_USER } from "../../constants";

const LoginModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const [loginInfo, setLoginInfo] = useState(
    JSON.parse(localStorage.getItem(SAVED_USER)) || {}
  );

  const rememberLogin = (value) => {
    setLoginInfo(value);
    localStorage.setItem(SAVED_USER, JSON.stringify(value));
  };

  const forgetLogin = (value) => {
    if (
      value.username === loginInfo.username &&
      value.identity === loginInfo.identity
    ) {
      setLoginInfo({});
      localStorage.removeItem(SAVED_USER);
    }
  };

  const onOk = () => {
    form.validateFields().then((value) => {
      const { username, password, identity, remember } = value;
      if (remember) rememberLogin(value);
      else forgetLogin(value);
      onCreate({ username, password, identity });
    });
    // .catch((e) => {
    //   console.log(e);
    // });
  };

  // const onForgetPassword = () => {
  //   // TODO
  // };

  const createFooter = () => {
    return [
      <Button
        style={{ borderRadius: "5px" }}
        key="login"
        type="primary"
        onClick={onOk}
      >
        登入
      </Button>,
      // <Button key="forget" type="danger" onClick={onForgetPassword}>
      //   忘記密碼
      // </Button>,
      <Button style={{ borderRadius: "5px" }} key="cancel" onClick={onCancel}>
        取消
      </Button>,
    ];
  };

  return (
    <Modal
      visible={visible}
      title="登入"
      footer={createFooter()}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} name="login_form" initialValues={loginInfo || {}}>
        <Form.Item
          name="username"
          label="帳號"
          rules={[
            {
              required: true,
              message: "請輸入帳號",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="密碼"
          rules={[
            {
              required: true,
              message: "請輸入密碼",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="identity"
          label="登入身份"
          rules={[
            {
              required: true,
              message: "請選擇身份",
            },
          ]}
        >
          <Radio.Group>
            <Radio value="patient">校隊學生</Radio>
            <Radio value="doctor">物治學生</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>記住我</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default LoginModal;
