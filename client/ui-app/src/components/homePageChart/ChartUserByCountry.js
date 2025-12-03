import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  Sector
} from "recharts";

import { getAllClientBusinessList } from "../../redux/actions/businessListAction";
import "./homeChart.css";

const chartColors = [
  "#28a745",
  "#007bff",
  "#ff9800",
  "#9c27b0",
  "#e91e63",
  "#00bcd4",
  "#14b8a6",
  "#8b5cf6"
];

/* ----------------------------------------------------
   CUSTOM TOOLTIP
---------------------------------------------------- */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className="tooltip-box">
        <h4>{label}</h4>
        <p>
          <strong>{d.name}:</strong> {d.value}{" "}
          {d.payload?.total
            ? `(${((d.value / d.payload.total) * 100).toFixed(1)}%)`
            : ""}
        </p>
      </div>
    );
  }
  return null;
};

/* ----------------------------------------------------
   ACTIVE SHAPE FOR DONUT HOVER (slice pops out)
---------------------------------------------------- */
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10} // pop-out
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

/* ----------------------------------------------------
   MONTHLY DATA AGGREGATION
---------------------------------------------------- */
const aggregateBusinessData = (clientBusinessList) => {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const map = new Map();
  for (let i = 0; i <= currentMonth; i++) {
    map.set(i, { name: months[i], "New Businesses": 0 });
  }

  (clientBusinessList || []).forEach((b) => {
    if (b.createdAt) {
      const d = new Date(b.createdAt);
      if (d.getFullYear() === year) {
        const m = d.getMonth();
        if (map.has(m)) map.get(m)["New Businesses"]++;
      }
    }
  });

  const result = Array.from(map.values());
  const max = Math.max(...result.map((d) => d["New Businesses"]), 0);
  const total = result.reduce((s, d) => s + d["New Businesses"], 0);
  result.forEach((r) => (r.total = total));

  return { result, max, total };
};

/* ----------------------------------------------------
   CATEGORY AGGREGATION
---------------------------------------------------- */
const aggregateBusinessCategory = (clientBusinessList) => {
  const map = {};
  (clientBusinessList || []).forEach((b) => {
    const cat = b.category || "Uncategorized";
    map[cat] = (map[cat] || 0) + 1;
  });

  const arr = Object.entries(map).map(([category, count]) => ({
    category,
    count
  }));

  const total = arr.reduce((s, d) => s + d.count, 0);
  arr.forEach((d) => (d.total = total));
  return { arr, total };
};

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */
export default function DashboardCharts() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllClientBusinessList());
  }, [dispatch]);

  const { clientBusinessList = [] } = useSelector(
    (state) => state.businessListReducer || {}
  );

  const {
    result: chart1Data,
    max: max1,
    total: totalThisYear
  } = useMemo(() => aggregateBusinessData(clientBusinessList), [clientBusinessList]);

  const yMax1 = Math.ceil(max1 / 5) * 5 || 5;

  const { arr: chart2Data, total: totalInCategories } = useMemo(
    () => aggregateBusinessCategory(clientBusinessList),
    [clientBusinessList]
  );

  const bestMonthObj =
    chart1Data.length > 0
      ? chart1Data.reduce(
          (best, cur) =>
            cur["New Businesses"] > best["New Businesses"] ? cur : best,
          chart1Data[0]
        )
      : { name: "-", "New Businesses": 0 };

  const avgPerMonth =
    chart1Data.length > 0
      ? Math.round(totalThisYear / chart1Data.length)
      : 0;

  // donut hover active slice
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // top categories for breakdown list
  const topCategories = [...chart2Data].sort((a, b) => b.count - a.count).slice(0, 6);

  return (
    <div className="dashboard-container">

      {/* ---------------------------------------------------- */}
      {/*                    CHART 1                           */}
      {/* ---------------------------------------------------- */}
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h2>Monthly New Business Trend</h2>
            <p>Year-to-date performance</p>
          </div>

          <div className="tag-group">
            <span className="tag tag-primary">YTD</span>
            <span className="tag tag-soft">Updated now</span>
          </div>
        </div>

        {/* metric strip */}
        <div className="metric-strip">
          <div className="metric-box">
            <span className="metric-label">Total this year</span>
            <span className="metric-value">{totalThisYear}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Best month</span>
            <span className="metric-value">
              {bestMonthObj.name} ({bestMonthObj["New Businesses"]})
            </span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Avg / month</span>
            <span className="metric-value">{avgPerMonth}</span>
          </div>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chart1Data}>
              <defs>
                <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors[0]} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={chartColors[0]} stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, yMax1]} />

              <Tooltip content={<CustomTooltip />} />

              <ReferenceLine
                y={Math.ceil(max1 / 2)}
                stroke="#ff9800"
                strokeDasharray="5 5"
                label={{ value: "Average", position: "insideTopRight" }}
              />

              <Area
                type="monotone"
                dataKey="New Businesses"
                stroke={chartColors[0]}
                fill="url(#chart-area)"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="New Businesses"
                stroke={chartColors[0]}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/*                    DONUT CHART                       */}
      {/* ---------------------------------------------------- */}
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h2>Business Distribution by Category</h2>
            <p>Category-wise segmentation</p>
          </div>

          <div className="tag-group">
            <span className="tag tag-primary">Active</span>
            <span className="tag tag-soft">Categories</span>
          </div>
        </div>

        <div className="chart-wrapper donut-wrapper">

          {/* Center Label */}
          <div className="donut-center">
            <strong>{totalInCategories}</strong>
            <span>Total businesses</span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chart2Data}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={3}
                stroke="#fff"
                strokeWidth={2}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
              >
                {chart2Data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={chartColors[i % chartColors.length]}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* category breakdown */}
          <div className="donut-breakdown">
            {topCategories.map((item, idx) => {
              const pct = totalInCategories
                ? ((item.count / totalInCategories) * 100).toFixed(1)
                : 0;
              return (
                <div className="breakdown-row" key={idx}>
                  <div className="breakdown-header">
                    <div className="breakdown-title">
                      <span
                        className="legend-dot"
                        style={{
                          background: chartColors[idx % chartColors.length]
                        }}
                      />
                      {item.category}
                    </div>
                    <div className="breakdown-meta">
                      <span className="breakdown-count">{item.count}</span>
                      <span className="breakdown-percent">{pct}%</span>
                    </div>
                  </div>
                  <div className="breakdown-bar-track">
                    <div
                      className="breakdown-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: chartColors[idx % chartColors.length]
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
