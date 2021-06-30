import { Modal, Form, Button } from "antd";
import { useState } from "react";
import RecordForm from "../forms/RecordForm";

const RecordModal = ({ visible, mode, record, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const isReadOnly = (mode) => {
    switch (mode) {
      case "view":
        return true;
      case "modify":
        return false;
      default:
        return true;
    }
  };

  const [readOnly, setReadOnly] = useState(isReadOnly(mode));

  const onOk = () => {
    form.validateFields().then((values) => {
      console.log(values);
      onCreate(values);
    });
    // .catch((e) => {
    //   displayStatus({
    //     type: "error",
    //     msg: e.message,
    //   });
    // });
  };

  const createFooter = (mode) => {
    switch (mode) {
      case "view":
        return [
          <Button key="close" onClick={onCancel}>
            關閉
          </Button>,
        ];
      case "modify":
        return [
          <Button key="create" type="primary" onClick={onOk}>
            儲存病歷
          </Button>,
          <Button key="close" onClick={onCancel}>
            關閉
          </Button>,
        ];
      default:
        return [];
    }
  };

  return (
    <Modal
      visible={visible}
      title="病歷"
      footer={createFooter(mode)}
      onCancel={onCancel}
      onOk={onOk}
    >
      <RecordForm
        form={form}
        initialValues={record || {}}
        readOnly={readOnly}
      />
    </Modal>
  );
};
export default RecordModal;
