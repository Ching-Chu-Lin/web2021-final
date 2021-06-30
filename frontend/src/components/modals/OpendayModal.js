import { Modal, Form, Input, Radio, Button } from "antd";
import OpendayForm from "../forms/OpendayForm";

const OpendayModal = ({ visible, onCancel }) => {
  // const [form] = Form.useForm();

  // const onOk = () => {
  //   form.validateFields().then((value) => {
  //     onCreate(value);
  //   });
  //   // .catch((e) => {
  //   //   displayStatus({
  //   //     type: "error",
  //   //     msg: e.message,
  //   //   });
  //   // });
  // };

  const createFooter = () => {
    return [
      <Button key="close" onClick={onCancel}>
        關閉
      </Button>,
    ];
  };

  const opendays = [
    { weekday: "SUNDAY", doctor: "" },
    { weekday: "MONDAY", doctor: "1" },
    { weekday: "TUESDAY", doctor: "2" },
    { weekday: "WEDNESDAY", doctor: "3" },
    { weekday: "THURSDAY", doctor: "4" },
    { weekday: "FRIDAY", doctor: "5" },
    { weekday: "SATURDAY", doctor: "" },
  ];

  return (
    <Modal
      visible={visible}
      title="服務時間"
      footer={createFooter()}
      onCancel={onCancel}
      // onOk={onOk}
    >
      {opendays.map((day) => (
        <OpendayForm day={day} />
      ))}
      {/* <Form form={form} name="form_in_modal" initialValues={{ identity }}>
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
      </Form> */}
    </Modal>
  );
};
export default OpendayModal;
