import { useState } from "react";
import moment from "moment";
import { makeStyles, GridListTile } from "@material-ui/core";
import { Button } from "antd";

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

  // const [data, setData] = useState({});

  const data = {
    physiotherapyStudent: "怪醫黑傑克",
    availableTime: "18:00-20:00",
    numbers: 3,
    patients: { name: "" },
  };

  return thisDay < moment().startOf("day") ? (
    <GridListTile key={date} className={classes.passedDateTile}>
      <p>{thisDay.format("MM/DD")}</p>
    </GridListTile>
  ) : data.availableTime === "" ? (
    <GridListTile key={date} className={classes.futureDateTile}>
      <p>{thisDay.format("MM/DD")}</p>
      <p style={{ color: "red" }}>本日無服務</p>
    </GridListTile>
  ) : (
    <GridListTile key={date} className={classes.futureDateTile}>
      <p>{thisDay.format("MM/DD")}</p>
      <p>物治學生：{data.physiotherapyStudent}</p>
      <p>服務時間：{data.availableTime}</p>
      <p>目前預約人數：{data.numbers}</p>
      {data.patients ? (
        <Button type="primary" style={{ background: "rgb(7, 181, 59)" }}>
          <span class="material-icons">done</span>
          已預約
        </Button>
      ) : (
        <Button type="primary">預約</Button>
      )}
    </GridListTile>
  );
};

export default Daily;
