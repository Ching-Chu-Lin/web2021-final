import moment from "moment";
import { makeStyles, GridList, GridListTile, Icon } from "@material-ui/core";
import { Button } from "antd";

const data = [
  {
    date: "2021-06-20",
    availableTime: "",
  },
  {
    date: "2021-06-21",
    physiotherapyStudent: "怪醫黑傑克",
    availableTime: "18:00-20:00",
    numbers: 3,
    patients: { name: "" },
  },
  {
    date: "2021-06-22",
    availableTime: "",
  },
  {
    date: "2021-06-23",
    physiotherapyStudent: "古利夏．葉卡",
    availableTime: "18:00-20:00",
    numbers: 3,
    patients: null,
  },
  {
    date: "2021-06-24",
    availableTime: "",
  },
  {
    date: "2021-06-25",
    physiotherapyStudent: "喬巴",
    availableTime: "18:00-20:00",
    numbers: 3,
    patients: null,
  },
  {
    date: "2021-06-26",
    availableTime: "",
  },
  {
    date: "2021-06-27",
    availableTime: "",
  },
  {
    date: "2021-06-28",
    physiotherapyStudent: "雷歐力",
    availableTime: "18:00-20:00",
    numbers: 3,
    patients: null,
  },
  {
    date: "2021-06-29",
    availableTime: "",
  },
  {
    date: "2021-06-30",
    physiotherapyStudent: "提姆．馬可",
    availableTime: "18:00-20:00",
    numbers: 3,
    patients: null,
  },
  {
    date: "2021-07-01",
    availableTime: "",
  },
  {
    date: "2021-07-02",
    physiotherapyStudent: "怪醫黑傑克",
    availableTime: "18:00-20:00",
    numbers: 3,
    patients: null,
  },
  {
    date: "2021-07-03",
    availableTime: "",
  },
];

const Calendar = () => {
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
      backgroundColor: "rgb(224, 224, 224)",
      minHeight: 250,
    },
    futureDateTile: {
      backgroundColor: "rgb(255, 254, 209)",
      minHeight: 250,
    },
  }));
  const classes = useStyles();

  const nextTwoWeeks = () => {
    const beginOfCurrentWeek = moment().startOf("week");
    let days = [];
    for (let i = 0; i < 14; i++) {
      days.push(beginOfCurrentWeek.format("YYYY-MM-DD"));
      beginOfCurrentWeek.add(1, "days");
    }
    return days;
  };

  const weekdayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const showingDays = nextTwoWeeks();
  console.log(data);

  return (
    <div className={classes.root}>
      <GridList cellHeight={50} cols={7} className={classes.header}>
        {weekdayName.map((e) => (
          <GridListTile className={classes.headerTile}>
            <span>{e}</span>
          </GridListTile>
        ))}
      </GridList>
      <GridList cellHeight={200} cols={7} className={classes.date}>
        {data.map((day) => {
          console.log(day);
          const thisDay = moment(day.date);

          return thisDay < moment().startOf("day") ? (
            <GridListTile key={day.date} className={classes.passedDateTile}>
              <p>{thisDay.format("MM/DD")}</p>
            </GridListTile>
          ) : day.availableTime === "" ? (
            <GridListTile key={day.date} className={classes.futureDateTile}>
              <p>{thisDay.format("MM/DD")}</p>
              <p style={{ color: "red" }}>本日無服務</p>
            </GridListTile>
          ) : (
            <GridListTile key={day.date} className={classes.futureDateTile}>
              <p>{thisDay.format("MM/DD")}</p>
              <p>物治學生：{day.physiotherapyStudent}</p>
              <p>服務時間：{day.availableTime}</p>
              <p>目前預約人數：{day.numbers}</p>
              {day.patients ? (
                <Button type="primary" style={{ background: "green" }}>
                  {/* <Icon>done</Icon> */}
                  <span class="material-icons">done</span>
                  已預約
                </Button>
              ) : (
                <Button type="primary">預約</Button>
              )}
            </GridListTile>
          );
        })}
      </GridList>
    </div>
  );
};

export default Calendar;
