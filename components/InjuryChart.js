import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useInjury } from "./context/InjuryContext";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { useState, useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const injuryArea = [
  "Head",
  "Neck",
  "Shoulder",
  "Arm",
  "Hand",
  "Torso",
  "Leg",
  "Foot",
];

export function InjuryChart() {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [injuryChart, setInjuryChart] = useState({});

  const { injuries } = useInjury();

  useEffect(() => {
    if (injuries) {
      const injuryData = injuries
        .map((injury) => {
          return injury.injuryItem;
        })
        .flat()
        .filter((injury) => {
          const dateToCheck = dayjs(injury.injuryDate);

          return dateToCheck.isSame(`${selectedYear}`, "year");
        })
        .map((injury) => {
          return {
            injuryMonth: dayjs(injury.injuryDate).format("MMMM"),
            bodyPart: injury.bodyPart,
          };
        });

      const dataCounts = injuryData.reduce((acc, entry) => {
        const key = `${entry.injuryMonth}-${entry.bodyPart}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const datasets = injuryArea.map((area) => ({
        label: area,
        data: labels.map((month) => dataCounts[`${month}-${area}`] || 0),
        backgroundColor: getRandomColor(),
      }));

      const data = {
        labels,
        datasets,
      };

      setInjuryChart(data);
    }
  }, [selectedYear, injuries]);

  const handleYearChange = (date, dateString) => {
    setSelectedYear(dayjs(date).year());
  };

  if (Object.keys(injuryChart).length === 0) return <p>No injuries found</p>;

  return (
    <>
      <DatePicker
        picker="year"
        defaultValue={dayjs().year("2023")}
        onChange={handleYearChange}
        placeholder="Select Year"
        style={{ marginBottom: "16px" }}
      />
      <Bar options={options} data={injuryChart} />
    </>
  );
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
