import { Form, Input, Button, Radio } from "antd";
import { useState } from "react";

const OpendayForm = ({ day }) => {
  const [form] = Form.useForm();

  const weekdayEtoC = (weekday) => {
    switch (weekday) {
      case "SUNDAY":
        return "星期日";
      case "MONDAY":
        return "星期一";
      case "TUESDAY":
        return "星期二";
      case "WEDNESDAY":
        return "星期三";
      case "THURSDAY":
        return "星期四";
      case "FRIDAY":
        return "星期五";
      case "SATURDAY":
        return "星期六";
      default:
        return "";
    }
  };

  const checkDayOpen = (day) => {
    if (!day) return false;
    if (!day.doctor) return false;
    if (day.doctor === "") return false;
    return true;
  };

  const [open, setOpen] = useState(checkDayOpen(day));

  const onOpenChange = (changedValue, { open, doctor }) => {
    console.log(open);
    setOpen(open);
    if (!open) form.setFieldsValue({ doctor: "" }); //  Maybe not needed?
  };

  const [readOnly, setReadOnly] = useState(true);

  const onOk = () => {
    form.validateFields().then((value) => {
      console.log(value);
      setReadOnly(true);
    });
  };

  const onEdit = () => {
    setReadOnly(false);
  };

  return (
    <Form
      form={form}
      name="openday_form"
      layout="inline"
      initialValues={{ open, doctor: day.doctor || "" }}
      onValuesChange={onOpenChange}
    >
      <Form.Item label={weekdayEtoC(day.weekday)}>
        <Input.Group compact>
          <Form.Item
            name="open"
            rules={[
              {
                required: true,
                message: "請選擇是否服務",
              },
            ]}
          >
            <Radio.Group disabled={readOnly}>
              <Radio value={false}>無</Radio>
              <Radio value={true}>有，物治學生</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="doctor"
            // rules={[
            //   {
            //     required: { open },
            //     message: "請輸入物治學生",
            //   },
            // ]}
          >
            <Input
              style={{ width: 100 }}
              readOnly={readOnly}
              disabled={!open}
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item>
        {readOnly ? (
          <Button key="modify" type="primary" onClick={onEdit}>
            修改
          </Button>
        ) : (
          <Button key="modify" type="primary" onClick={onOk}>
            送出
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default OpendayForm;
