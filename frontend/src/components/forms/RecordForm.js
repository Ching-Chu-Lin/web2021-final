import { Form, Input, Slider } from "antd";

const RecordForm = ({ form, initialValues, readOnly }) => {
  const { TextArea } = Input;

  return (
    <Form form={form} name="form_in_modal" initialValues={initialValues} >
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
  );
};

export default RecordForm;
