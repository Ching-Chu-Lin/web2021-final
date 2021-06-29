import { Modal, Layout, Menu, Form, Button } from "antd";
import { useState } from "react";
import AppointmentForm from "../forms/AppointmentForm";

const PatientsModal = ({ visible, mode, patients, onCreate, onCancel }) => {
  const { Sider, Content } = Layout;
  const [form] = Form.useForm();

  // const [currentAppointment, setCurrentAppointment] = useState({});

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
      title="預約"
      footer={createFooter(mode)}
      onCancel={onCancel}
      onOk={onOk}
    >
      {console.log(patients)}
      <Layout>
        <Sider width="20%" theme="light">
          <Menu mode="inline" >
            {patients.map((patient) => {
              console.log(patient);
              return (
                <Menu.Item
                  style={{margin: "auto"}}
                  key={patient.name}
                  onClick={() => {
                    form.setFieldsValue(patient.appointment);
                  }}
                >
                  {patient.name}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Content style={{alignItems:"center", padding: "10px", paddingTop: "20px", paddingBottom: "0px"}}>
          <AppointmentForm
            form={form}
            // initialValues={currentAppointment}
            readOnly={readOnly}
          />
        </Content>
      </Layout>
    </Modal>
  );
};
export default PatientsModal;
