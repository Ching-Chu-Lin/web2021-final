import { Modal, Layout, Menu, Form, Button } from "antd";
import { useState } from "react";
import RecordForm from "../forms/RecordForm";

const PatientsModal = ({ visible, mode, appointments, onCreate, onCancel }) => {
  const { Sider, Content } = Layout;
  const [form] = Form.useForm();

  const findRecord = (appointment) => {
    const record = null; // TODO: ask backend
    if (!record) return { ...appointment, injury: "", treatment: "" };
  };

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
      title="本日病人"
      footer={createFooter(mode)}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Layout>

        <Sider width="20%" theme="light">
          <Menu mode="inline">
            {appointments.map((appointment) => {
              return (
                <Menu.Item
                  style={{margin: "auto"}}
                  key={appointment.patient.username}
                  onClick={() => {
                    const record = findRecord(appointment);
                    form.setFieldsValue(record);
                  }}
                >
                  {appointment.patient.username}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Content style={{alignItems:"center", padding: "10px", paddingTop: "20px", paddingBottom: "0px"}}>
          <RecordForm form={form} readOnly={readOnly} />
        </Content>
      </Layout>
    </Modal>
  );
};
export default PatientsModal;
