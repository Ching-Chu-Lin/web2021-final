import { Form, Input, Button, Radio, Modal } from "antd";
import { useState, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import AuthContext from "../../context/AuthContext";
import DisplayContext from "../../context/DisplayContext";
import {
  CREATE_OPENDAY_MUTATION,
  DELETE_OPENDAY_MUTATION,
} from "../../graphql";

const OpendayForm = ({ day }) => {
  const [form] = Form.useForm();

  const [token, setToken] = useContext(AuthContext);

  const { displayStatus } = useContext(DisplayContext);

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
    setOpen(open);
    if (!open) form.setFieldsValue({ doctor: "" }); //  Maybe not needed?
  };

  const [readOnly, setReadOnly] = useState(true);

  const [createOpenday] = useMutation(CREATE_OPENDAY_MUTATION);

  const [deleteOpenday] = useMutation(DELETE_OPENDAY_MUTATION);

  const onConfirm = () => {
    form
      .validateFields()
      .then(async ({ open, doctor }) => {
        if (open) {
          try {
            await createOpenday({
              variables: { data: { weekday: day.weekday, doctor } },
              context: {
                headers: {
                  authorization: token ? `Bearer ${token}` : "",
                },
              },
            });
          } catch (e) {
            displayStatus({ type: "error", msg: e.message });
          }
        } else {
          try {
            await deleteOpenday({
              variables: { weekday: day.weekday },
              context: {
                headers: {
                  authorization: token ? `Bearer ${token}` : "",
                },
              },
            });
          } catch (e) {
            displayStatus({ type: "error", msg: e.message });
          }
        }
        setReadOnly(true);
        displayStatus({ type: "success", msg: "修改成功" });
      })
      .catch((e) => {
        displayStatus({
          type: "error",
          msg: e.message,
        });
      });
  };

  const onEdit = () => {
    setReadOnly(false);
  };

  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: "確定送出？",
      onOk() {
        onConfirm();
      },
      onCancel() {},
    });
  };

  return (
    <Form
      form={form}
      name="openday_form"
      style={{ padding: "10px" }}
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
          <Button
            style={{ borderRadius: "5px" }}
            key="modify"
            type="primary"
            onClick={onEdit}
          >
            修改
          </Button>
        ) : (
          <Button
            style={{ borderRadius: "5px" }}
            key="modify"
            type="primary"
            onClick={showConfirm}
          >
            送出
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default OpendayForm;
