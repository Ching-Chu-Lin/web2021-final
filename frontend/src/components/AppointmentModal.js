import { Modal, Form, Input, Slider, Button } from "antd";
import { useState } from "react";

const AppointmentModal = ({
  visible,
  mode,
  appointment,
  onCreate,
  onCancel,
  onDelete,
}) => {
  const [form] = Form.useForm();

  const isReadOnly = (mode) => {
    switch (mode) {
      case "create":
        return false;
      case "modify":
        return true;
      default:
        return true;
    }
  };

  const [readOnly, setReadOnly] = useState(isReadOnly(mode));

  const onOk = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      values = { ...values, description: values.description || "" };
      onCreate(values);
    });
    // .catch((e) => {
    //   displayStatus({
    //     type: "error",
    //     msg: e.message,
    //   });
    // });
  };

  const onEdit = () => {
    setReadOnly(false);
  };

  const createTitle = (mode) => {
    switch (mode) {
      case "create":
        return "建立預約";
      case "modify":
        return "我的預約";
      default:
        return "";
    }
  };

  const createFooter = (mode) => {
    switch (mode) {
      case "create":
        return [
          <Button key="create" onClick={onOk}>
            預約
          </Button>,
          <Button key="cancel" onClick={onCancel}>
            取消
          </Button>,
        ];
      case "modify":
        return [
          readOnly ? (
            <Button key="modify" type="primary" onClick={onEdit}>
              修改預約
            </Button>
          ) : (
            <Button key="modify" type="primary" onClick={onOk}>
              送出修改
            </Button>
          ),
          <Button key="delete" type="danger" onClick={onDelete}>
            刪除預約
          </Button>,
          <Button key="cancel" onClick={onCancel}>
            取消
          </Button>,
        ];
      default:
        return [];
    }
  };

  return (
    <Modal
      visible={visible}
      title={createTitle(mode)}
      footer={createFooter(mode)}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={appointment || {}}
      >
        <Form.Item
          name="part"
          label="受傷部位"
          rules={[
            {
              required: true,
              message: "請輸入受傷部位",
            },
          ]}
        >
          <Input readOnly={readOnly} />
        </Form.Item>

        <Form.Item
          name="level"
          label="疼痛程度"
          rules={[
            {
              required: true,
              message: "請選擇疼痛程度",
            },
          ]}
        >
          <Slider
            max={10}
            step={0.1}
            marks={{ 0: "0", 10: "10" }}
            readOnly={readOnly}
          />
        </Form.Item>
        <Form.Item name="description" label="簡單描述">
          <Input readOnly={readOnly} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AppointmentModal;
