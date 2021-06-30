import { Modal, Form, Input, Button } from "antd";
import { useState } from "react";

const ChangeUsernameModal = ({ visible, user, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields().then((value) => {
      form.resetFields(["password", "newUsername"]);
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
        style={{borderRadius: "5px"}}
        key="login" 
        type="primary" 
        onClick={onOk}>
        更改姓名
      </Button>,
      <Button 
        style={{borderRadius: "5px"}}
        key="cancel" 
        onClick={onCancel}>
        取消
      </Button>,
    ];
  };

  return (
    <Modal
      visible={visible}
      title="更改姓名"
      footer={createFooter()}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form
        form={form}
        name="change_username_form"
        initialValues={{ username: user.username }}
      >
        <Form.Item
          name="username"
          label="原帳號"
          rules={[
            {
              required: true,
              message: "請輸入原帳號",
            },
          ]}
        >
          <Input readOnly={true} />
        </Form.Item>

        <Form.Item
          name="oldPassword"
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
          name="newUsername"
          label="新帳號"
          rules={[
            {
              required: true,
              message: "請輸入新帳號",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ChangeUsernameModal;
