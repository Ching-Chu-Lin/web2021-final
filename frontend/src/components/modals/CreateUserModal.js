import { Modal, Form, Input, Radio, Button } from "antd";

const CreateUserModal = ({ visible, identity, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields().then((value) => {
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
        確定
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
      title="新增使用者"
      footer={createFooter()}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} name="create_user_form" initialValues={{ identity }}>
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
          <Radio.Group disabled={true}>
            <Radio value="patient">校隊學生</Radio>
            <Radio value="doctor">物治學生</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateUserModal;
