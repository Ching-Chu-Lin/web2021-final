import { Modal, Form, Input, Slider, Button } from "antd";
import { useState } from "react";

const RecordModal = ({ visible, mode, record, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const { TextArea } = Input;

  const isReadOnly = (mode) => {
    switch (mode) {
      case "view":
        return true;
      default:
        return true;
    }
  };

  const [readOnly, setReadOnly] = useState(isReadOnly(mode));

  const onOk = () => {
    form.validateFields().then((values) => {
      form.resetFields();
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

  const onEdit = () => {
    setReadOnly(false);
  };

  //   const createTitle = (mode) => {
  //     switch (mode) {
  //       case "create":
  //         return "建立預約";
  //       case "modify":
  //         return "我的預約";
  //       default:
  //         return "";
  //     }
  //   };

  const createFooter = (mode) => {
    switch (mode) {
      case "view":
        return [
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
      <Form form={form} name="form_in_modal" initialValues={record || {}}>
        <Form.Item
          label={<span style={{ fontWeight: "bold" }}>校隊評估狀況</span>}
        ></Form.Item>
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
          <Input readOnly={true} />
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
            disabled={true}
          />
        </Form.Item>
        <Form.Item name="description" label="簡單描述">
          <TextArea readOnly={true} autoSize />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: "bold" }}>物治處置</span>}
        ></Form.Item>
        <Form.Item
          name="injury"
          label="受傷狀況"
          rules={[
            {
              required: true,
              message: "請輸入受傷狀況",
            },
          ]}
        >
          <TextArea readOnly={readOnly} autoSize />
        </Form.Item>

        <Form.Item
          name="treatment"
          label="治療方法"
          rules={[
            {
              required: true,
              message: "請輸入治療方法",
            },
          ]}
        >
          <TextArea readOnly={readOnly} autoSize />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default RecordModal;
