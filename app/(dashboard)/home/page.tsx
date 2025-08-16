"use client";
import { Box, Flex } from "@radix-ui/themes";
import React, { useEffect, useMemo } from "react";
import DoughnutChart from "./ChartJS";
import { useStoreGrammars } from "@/app/redux/store";
import { LABELS_GRAMMAR } from "../constants";
import DecorativeBox from "./DecorativeBox";
import Grammars from "./Grammars";
import { mapDataChart } from "./utils/chartUtils";

const Dashboard: React.FC = () => {
  const queryGrammars = useStoreGrammars();

  useEffect(() => {
    if (!queryGrammars.isEmpty && !queryGrammars.loading) {
      return;
    }
    queryGrammars.fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryGrammars.isEmpty, queryGrammars.loading, queryGrammars.fetchData]);

  const chartData = useMemo(
    () => mapDataChart(queryGrammars.data || {}),
    [queryGrammars.data]
  );

  const totalItems = useMemo(
    () =>
      Object.values(queryGrammars.data || {}).reduce(
        (sum: number, items: any) =>
          sum + (Array.isArray(items) ? items.length : 0),
        0
      ),
    [queryGrammars.data]
  );

  if (queryGrammars.loading) {
    return (
      <div className="bg-white rounded-md p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading grammar data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md p-6 space-y-6">
      {/* Summary Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Grammar Overview
        </h2>
        <Flex gap="3" className="flex-wrap">
          {LABELS_GRAMMAR.map((item) => (
            <Box key={`${item}-box`} width="120px">
              <DecorativeBox
                title={item}
                count={queryGrammars.data?.[item]?.length ?? 0}
              />
            </Box>
          ))}
        </Flex>
        <div className="mt-4 text-sm text-gray-600">
          Total items: {totalItems.toLocaleString()}
        </div>
      </div>

      {/* Chart and Grammar List */}
      <Flex className="flex-wrap py-4" gap="6">
        <div className="flex-1 min-w-80">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Distribution Chart
          </h3>
          <DoughnutChart labels={LABELS_GRAMMAR} dataSource={chartData} />
        </div>
        <div className="flex-1 min-w-80">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Grammar Practice
          </h3>
          <Grammars queryGrammars={queryGrammars} />
        </div>
      </Flex>
    </div>
  );
};

export default Dashboard;
