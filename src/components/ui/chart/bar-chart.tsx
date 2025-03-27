
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { ChartContainer } from "./chart-container"
import { ChartTooltipContent } from "./chart-tooltip-content"
import { ChartConfig } from "./types"

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  className?: string;
  layout?: "vertical" | "horizontal";
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  index,
  categories,
  colors = ["#4f46e5", "#0ea5e9", "#8b5cf6"],
  valueFormatter = (value) => value.toString(),
  yAxisWidth = 40,
  className,
  layout = "horizontal",
}) => {
  const defaultConfig: ChartConfig = {};
  
  return (
    <ChartContainer className={className} config={defaultConfig}>
      <RechartsPrimitive.BarChart
        data={data}
        layout={layout}
        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
      >
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" vertical={false} />
        
        {layout === "horizontal" ? (
          <>
            <RechartsPrimitive.XAxis
              dataKey={index}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <RechartsPrimitive.YAxis
              width={yAxisWidth}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => valueFormatter(value)}
            />
          </>
        ) : (
          <>
            <RechartsPrimitive.YAxis
              dataKey={index}
              type="category"
              width={yAxisWidth + 30}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <RechartsPrimitive.XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => valueFormatter(value)}
            />
          </>
        )}
        
        <RechartsPrimitive.Tooltip
          content={
            <ChartTooltipContent 
              formatter={(value) => valueFormatter(Number(value))}
            />
          }
        />
        
        {categories.map((category, index) => (
          <RechartsPrimitive.Bar
            key={category}
            dataKey={category}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
            barSize={layout === "horizontal" ? 20 : 15}
          />
        ))}
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  );
};
