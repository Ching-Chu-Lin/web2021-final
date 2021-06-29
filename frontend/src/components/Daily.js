import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
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
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
      width: 1000,
    },
    header: {
      width: "100%",
      height: 50,
    },
    date: {
      width: "100%",
    },
    headerTile: {
      backgroundColor: "rgb(220, 254, 209)",
    },
    passedDateTile: {
      backgroundColor: "rgb(240, 240, 240)",
      minHeight: 250,
      width: "14.2857%",
    },
    futureDateTile: {
      backgroundColor: "rgb(255, 254, 209)",
      minHeight: 250,
      width: "14.2857%",
    },
  }));
  const classes = useStyles();

  const thisDay = moment(date);

  const [modalVisible, setModalVisible] = useState(false);

  const [dailyData, setDailyData] = useState({
    doctor: "怪醫黑傑克", // doctor: ""
    numbers: 2,
    appointments: [
      {
        date: "2021-06-29",
        patient: {
          username: "智障",
        },
        part: "頭",
        level: 8,
        description: "智商不足",
      },
      {
        date: "2021-06-29",
        patient: {
          username: "智障2",
        },
        part: "腦",
        level: 7,
        description: "智商不足",
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

  const saveRecord = (record) => {
    console.log(record);
    // TODO: ask backend
  };

  return thisDay < moment().startOf("day") ? (
    <GridListTile key={date} className={classes.passedDateTile}>
      <p>{thisDay.format("MM/DD")}</p>
    </GridListTile>
  ) : dailyData.doctor === "" ? (
    <GridListTile key={date} className={classes.futureDateTile}>
      <p>{thisDay.format("MM/DD")}</p>
      <p style={{ color: "red" }}>本日無服務</p>
    </GridListTile>
  ) : (
    <GridListTile key={date} className={classes.futureDateTile}>
      <p>{thisDay.format("MM/DD")}</p>
      <p>物治學生：{dailyData.doctor}</p>
      <p>目前預約人數：{dailyData.numbers}</p>
      {user.identity === "patient" ? (
        dailyData.appointments.length > 0 &&
        dailyData.appointments[0].patient.username === user.username ? (
          <>
            <Button
              type="primary"
              style={{ background: "rgb(7, 181, 59)" }}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <span className="material-icons">done</span>
              已預約
            </Button>
            {console.log(dailyData.appointments[0])}
            <AppointmentModal
              visible={modalVisible}
              mode="modify"
              appointment={dailyData.appointments[0]}
              onCreate={(appointment) => {
                makeAppointment(appointment);
                setDailyData((oldDailyData) => ({
                  ...oldDailyData,
                  appointments: [
                    { ...appointment, patient: { username: user.username } },
                  ],
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
                  appointments: [],
                }));
                setModalVisible(false);
              }}
            />
          </>
        ) : (
          <>
            <Button
              type="primary"
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
                  appointments: [
                    { patient: { username: user.username }, ...appointment },
                  ],
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
      ) : user.identity === "doctor" ? (
        <>
          <Button
            type="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            查看
          </Button>
          <PatientsModal
            visible={modalVisible}
            mode="modify"
            appointments={dailyData.appointments || []}
            onCreate={(record) => {
              saveRecord(record);
              // setModalVisible(false);
            }}
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
