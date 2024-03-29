import { Modal, Form, Input, Button } from "antd";

const ChangePasswordModal = ({ visible, user, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields().then((value) => {
      form.resetFields(["oldPassword", "newPassword"]);
      onCreate(value);
    });
    // .catch((e) => {
    //   displayStatus({
    //     type: "error",
    //     msg: e.message,
    //   });
    // });
  };

  const createFooter = () => {
    return [
      <Button
        style={{ borderRadius: "5px" }}
        key="login"
        type="primary"
        onClick={onOk}
      >
        更改密碼
      </Button>,
      <Button style={{ borderRadius: "5px" }} key="cancel" onClick={onCancel}>
        取消
      </Button>,
    ];
  };

  return (
    <Modal
      visible={visible}
      title="更改密碼"
      footer={createFooter()}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form
        form={form}
        name="change_password_form"
        initialValues={{ username: user.username }}
      >
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
          <Input readOnly={true} />
        </Form.Item>

        <Form.Item
          name="oldPassword"
          label="舊密碼"
          rules={[
            {
              required: true,
              message: "請輸入舊密碼",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密碼"
          rules={[
            {
              required: true,
              message: "請輸入新密碼",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ChangePasswordModal;
