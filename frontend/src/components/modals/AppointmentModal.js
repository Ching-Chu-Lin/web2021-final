import { Modal, Form, Button } from "antd";
import { useState } from "react";
import AppointmentForm from "../forms/AppointmentForm";

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

  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: "確定刪除？",
      onOk(){
        onDelete();
      },
      onCancel(){}
    })
  }

  const onOk = () => {
    form.validateFields().then((values) => {
      // form.resetFields();
      setReadOnly(true);
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
          <Button style={{borderRadius: "5px"}} key="create" type="primary" onClick={onOk}>
            預約
          </Button>,
          <Button style={{borderRadius: "5px"}} key="cancel" onClick={onCancel}>
            取消
          </Button>,
        ];
      case "modify":
        return [
          readOnly ? (
            <Button style={{borderRadius: "5px"}} key="modify" type="primary" onClick={onEdit}>
              修改預約
            </Button>
          ) : (
            <Button style={{borderRadius: "5px"}} key="modify" type="primary" onClick={onOk}>
              送出修改
            </Button>
          ),
          <Button style={{borderRadius: "5px"}} key="delete" type="danger" onClick={showConfirm}>
            刪除預約
          </Button>,
          <Button
            style={{borderRadius: "5px"}}
            key="cancel"
            onClick={() => {
              onCancel();
              setReadOnly(true);
            }}
          >
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
      <AppointmentForm
        form={form}
        initialValues={appointment || {}}
        readOnly={readOnly}
      />
    </Modal>
  );
};
export default AppointmentModal;
