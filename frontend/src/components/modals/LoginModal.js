import { Modal, Form, Input, Radio, Button, Checkbox } from "antd";
import { useState } from "react";

const LoginModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const [loginInfo, setLoginInfo] = useState({}); // TODO: load from storage

  const rememberLogin = (value) => {
    setLoginInfo(value);
    // TODO: save to storage
  };

  const onOk = () => {
    form.validateFields().then((value) => {
      const { name, password, identity, remember } = value;
      if (remember) rememberLogin(value);
      onCreate({ name, password, identity });
    });
    // .catch((e) => {
    //   displayStatus({
    //     type: "error",
    //     msg: e.message,
    //   });
    // });
  };

  const onForgetPassword = () => {
    // TODO
  };

  const createFooter = () => {
    return [
      <Button key="login" type="primary" onClick={onOk}>
        登入
      </Button>,
      <Button key="forget" type="danger" onClick={onForgetPassword}>
        忘記密碼
      </Button>,
      <Button key="cancel" onClick={onCancel}>
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
      <Form form={form} name="form_in_modal" initialValues={loginInfo || {}}>
        <Form.Item
          name="name"
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
            <Radio value="team">校隊學生</Radio>
            <Radio value="physiotherapy">物治學生</Radio>
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
