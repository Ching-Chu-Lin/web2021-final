import { Modal, Layout, Menu, Form, Button } from "antd";
import { useState, useContext } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import RecordForm from "../forms/RecordForm";
import AuthContext from "../../context/AuthContext";
import { DAILY_USER_RECORD_QUERY, CREATE_RECORD_MUTATION } from "../../graphql";

const PatientsModal = ({
  visible,
  mode,
  date,
  appointments,
  onCreate,
  onCancel,
  user,
}) => {
  const { Sider, Content } = Layout;
  const [form] = Form.useForm();

  const [token, setToken] = useContext(AuthContext);

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

  const [currentPatient, setCurrentPatient] = useState("");

  const {
    loading,
    error,
    data: { queryUserRecordsByDate: record } = {},
    subscribeToMore,
    refetch,
  } = useQuery(DAILY_USER_RECORD_QUERY, {
    variables: { date, patientName: currentPatient },
    context: { headers: { authorization: token ? `Bearer ${token}` : "" } },
  });

  const [saveRecord] = useMutation(CREATE_RECORD_MUTATION);

  const onOk = () => {
    form.validateFields().then(async (values) => {
      console.log(values);
      const savedRecord = await saveRecord({
        variables: { data: { date, patientName: currentPatient, ...values } },
        context: { headers: { authorization: token ? `Bearer ${token}` : "" } },
      });
      console.log(savedRecord);
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
                  style={{ margin: "auto" }}
                  key={appointment.patient.username}
                  onClick={async () => {
                    setCurrentPatient(appointment.patient.username);
                    await refetch();
                    form.setFieldsValue(
                      record || {
                        ...appointment,
                        injury: null,
                        treatment: null,
                      }
                    );
                  }}
                >
                  {appointment.patient.username}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Content
          style={{
            alignItems: "center",
            padding: "10px",
            paddingTop: "20px",
            paddingBottom: "0px",
          }}
        >
          <RecordForm form={form} readOnly={readOnly} />
        </Content>
      </Layout>
    </Modal>
  );
};
export default PatientsModal;
