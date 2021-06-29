import { useState } from "react";
import moment from "moment";
import { makeStyles, GridListTile } from "@material-ui/core";
import { Button } from "antd";
import AppointmentModal from "./modals/AppointmentModal";
import PatientsModal from "./modals/PatientsModal";

const Daily = ({ user, date }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-end",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
      width: 1000,
    },
    date: {
      width: "100%",
    },
    passedDateTile: {
      background: 'linear-gradient(135deg, #F0F0F0 30%, #E5E5E5 90%)',
      minHeight: 250,
      width: "14.2857%",
    },
    futureDateTile: {
      background: 'linear-gradient(135deg, #FFFFE1 30%, #C8FAEA 90%)',
      minHeight: 250,
      width: "14.2857%",
    },
  }));
  const classes = useStyles();

  const thisDay = moment(date);

  const [modalVisible, setModalVisible] = useState(false);

  const [dailyData, setDailyData] = useState({
    physiotherapyStudent: "黑傑克",
    availableTime: "18:00-20:00",
    numbers: 1,
    patients: [
      {
        name: "智障",
        appointment: { part: "頭", level: 8.7, description: "智商不足" },
      },
    ],
  });

  const makeAppointment = (appointment) => {
    console.log({ user, date, appointment });
    // TODO: ask backend
  };

  const deleteAppointment = () => {
    console.log("delete: ", { user, date });
    // TODO: ask backend
  };

  return thisDay < moment().startOf("day") ? (
    <GridListTile key={date} className={classes.passedDateTile}>
      <p style={{position: "absolute",top: "5%", left: "0", right: "0", margin: "auto"}}>{thisDay.format("MM/DD")}</p>
    </GridListTile>
  ) : dailyData.availableTime === "" ? (
    <GridListTile key={date} className={classes.futureDateTile}>
      <p style={{position: "absolute",top: "5%", left: "0", right: "0", margin: "auto"}}>{thisDay.format("MM/DD")}</p>
      <p>本日無服務</p>
    </GridListTile>
  ) : (
    <GridListTile key={date} className={classes.futureDateTile}>
      {/* {console.log(dailyData)} */}
      <p style={{position: "absolute",top: "5%", left: "0", right: "0", margin: "auto"}}>{thisDay.format("MM/DD")}</p>
      <p style={{position: "absolute",top: "20%", left: "0", right: "0", margin: "auto"}}>物治學生：{dailyData.physiotherapyStudent}</p>
      <p style={{position: "absolute",top: "40%", left: "0", right: "0", margin: "auto"}}>服務時間：{dailyData.availableTime}</p>
      <p style={{position: "absolute",top: "80%", left: "0", right: "0", margin: "auto"}}>目前預約人數：{dailyData.numbers}</p>
      {user.identity === "team" ? (
        dailyData.patients ? (
          <>
            <Button
              type="primary"
              style={{ background: "rgb(7, 181, 59)" , position: "absolute",top: "60%", left: "0", right: "0", margin: "auto"}}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <span className="material-icons" >done</span>
              已預約
            </Button>
            {console.log(dailyData.patients[0].appointment)}
            <AppointmentModal
              visible={modalVisible}
              mode="modify"
              appointment={dailyData.patients[0].appointment}
              onCreate={(appointment) => {
                makeAppointment(appointment);
                setDailyData((oldDailyData) => ({
                  ...oldDailyData,
                  patients: [{ name: user.name, appointment }],
                }));
                setModalVisible(false);
              }}
              onCancel={() => {
                setModalVisible(false);
              }}
              onDelete={() => {
                deleteAppointment();
                setDailyData((oldDailyData) => ({
                  ...oldDailyData,
                  numbers: oldDailyData.numbers - 1,
                  patients: null,
                }));
                setModalVisible(false);
              }}
            />
          </>
        ) : (
          <>
            <Button
              type="primary"
              style={{position: "absolute",top: "60%", left: "0", right: "0", margin: "auto"}}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              預約
            </Button>
            <AppointmentModal
              visible={modalVisible}
              mode="create"
              onCreate={(appointment) => {
                makeAppointment(appointment);
                setDailyData((oldDailyData) => ({
                  ...oldDailyData,
                  numbers: oldDailyData.numbers + 1,
                  patients: [{ name: user.name, appointment }],
                }));
                setModalVisible(false);
                console.log(dailyData);
              }}
              onCancel={() => {
                setModalVisible(false);
              }}
            />
          </>
        )
      ) : user.identity === "physiotherapy" ? (
        <>
          <Button
            type="primary"
            style={{position: "absolute",top: "60%", left: "0", right: "0", margin: "auto"}}
            onClick={() => {
              setModalVisible(true);
            }}
          >
            查看
          </Button>
          <PatientsModal
            visible={modalVisible}
            mode="view"
            patients={dailyData.patients || []}
            onCancel={() => {
              setModalVisible(false);
            }}
          />
        </>
      ) : (
        <></>
      )}
    </GridListTile>
  );
};

export default Daily;
