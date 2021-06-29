import { Form, Input, Slider } from "antd";

const AppointmentForm = ({ form, initialValues, readOnly }) => {
  const { TextArea } = Input;

  return (
    <Form form={form} name="form_in_modal" initialValues={initialValues}>
      {console.log(initialValues)}
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
          step={1}
          marks={{ 0: "0", 10: "10" }}
          disabled={readOnly}
        />
      </Form.Item>
      <Form.Item name="description" label="簡單描述">
        <TextArea readOnly={readOnly} autoSize />
      </Form.Item>
    </Form>
  );
};

export default AppointmentForm;
