import { ChartOptions } from "chart.js";
import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { DoughnutChartProps } from "./types";
import { getChartColors } from "./utils/chartUtils";

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  labels,
  dataSource,
  callBack,
}) => {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Grammar Distribution",
          data: dataSource,
          backgroundColor: getChartColors(),
          hoverOffset: 4,
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    }),
    [dataSource, labels]
  );

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const total = dataSource.reduce((sum, value) => sum + value, 0);
            const percentage =
              total > 0 ? ((tooltipItem.raw / total) * 100).toFixed(1) : 0;
            return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
          },
        },
      },
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    onClick: callBack,
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default React.memo(DoughnutChart);
