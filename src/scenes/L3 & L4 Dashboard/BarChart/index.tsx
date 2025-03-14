// import React from "react";
// import {
//   BarChart,
//   Bar,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   XAxis,
//   LabelList
// } from "recharts";
// import dayjs from "dayjs";

// interface TableData {
//   creationTime: string; // ISO format date
//   supplierPendingValue: number;
//   buyerPendingValue: number;
//   fandCPendingValue: number;
//   iscreditnote: boolean;
// }

// interface AnalysisBarChartProps {
//   supplementaryDocStatus: TableData[];
// }

// // Function to get the start of each time bucket dynamically
// const categorizeDataByDays = (data: TableData[]) => {
//   const today = dayjs();
  
//   return data.reduce((acc, curr) => {
//     const creationDate = dayjs(curr.creationTime);
//     const diffDays = today.diff(creationDate, "day");

//     let category: any;
//     if (diffDays >= 0 && diffDays <= 15) category = "15";
//     else if (diffDays > 15 && diffDays <= 30) category = "30";
//     else if (diffDays > 30 && diffDays <= 45) category = "45";
//     else if (diffDays > 45 && diffDays <= 60) category = "60";
//     else if (diffDays > 60 && diffDays <= 90) category = "90";
//     else category = "91+";

//     const existingCategory = acc.find((item) => item.name === category);
//     if (existingCategory) {
//       existingCategory.Supplier += curr.supplierPendingValue;
//       existingCategory.Buyer += curr.buyerPendingValue;
//       existingCategory.FandC += curr.fandCPendingValue;
//     } else {
//       acc.push({
//         total: curr.buyerPendingValue + curr.supplierPendingValue + curr.fandCPendingValue,
//         name: category,
//         Supplier: curr.supplierPendingValue,
//         Buyer: curr.buyerPendingValue,
//         FandC: curr.fandCPendingValue,
//       });
//     }
//     return acc;
//   }, [] as { total: number; name: string; Supplier: number; Buyer: number; FandC: number }[] );
// };

// const AnalysisBarChart: React.FC<AnalysisBarChartProps> = ({ supplementaryDocStatus }) => {
//   // Filter records where iscreditnote is false
//   const filteredData = supplementaryDocStatus.filter(item => !item.iscreditnote);

//   // Aggregate and categorize the data dynamically
//   const aggregatedData = categorizeDataByDays(filteredData);

//   // Sort data by X-axis categories
//   const sortedData = aggregatedData.sort((a, b) => {
//     const order = ["15", "30", "45", "60", "90", "91+"];
//     return order.indexOf(a.name) - order.indexOf(b.name);
//   });

//   // Custom Tooltip to display the total value
//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       const total = payload[0].payload.Supplier + payload[0].payload.Buyer + payload[0].payload.FandC;
//       return (
//         <div style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
//           <p>{`${label} days`}</p>
//           <p>{`Total Pending Value: ${total}`}</p>
//           <p>{`Supplier: ${payload[0].payload.Supplier}`}</p>
//           <p>{`Buyer: ${payload[0].payload.Buyer}`}</p>
//           <p>{`FandC: ${payload[0].payload.FandC}`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   const CustomLabel = ({ x, y, width, height, value }: any) => {  // Added width and height
//     if (value > 0) {
//       const centerX = x + width / 2; // Calculate center of the bar
//       const centerY = y + height / 2; // Calculate center of the bar

//       return (
//         <text x={centerX} y={centerY} dominantBaseline="middle" textAnchor="middle" fill="black" fontSize={12}> {/* White text for visibility */}
//           {value}
//         </text>
//       );
//     }
//     return null;
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         overflowX: "auto",
//         border: "2px solid #ccc",
//         borderRadius: "10px",
//         paddingTop: "45px",
//       }}
//     >
//     <ResponsiveContainer width="100%" height={350}>
//   <BarChart data={sortedData} margin={{ top: 40, right: 30, left: 20, bottom: 50 }} barGap={1} barCategoryGap="5%">
//     <text
//       x="50%"
//       y="5"
//       textAnchor="middle"
//       dominantBaseline="hanging"
//       fontSize="18px"
//       fontWeight="bold"
//     >
//       Pending Analysis by Days
//     </text>

//     <CartesianGrid strokeDasharray="3 3" />

//     {/* Custom X-Axis for each category */}
//     <XAxis dataKey="name" />

//     {/* Custom Tooltip */}
//     <Tooltip content={<CustomTooltip />} />

//     {/* Custom Legend */}
//     <Legend />

//     {/* Stacked Bars with custom label */}
//     <Bar dataKey="Supplier" stackId="stack" fill="#8884d8" barSize={80}>
//       <LabelList dataKey="Supplier" content={<CustomLabel />} />
//     </Bar>
//     <Bar dataKey="Buyer" stackId="stack" fill="#82ca9d" barSize={80}>
//       <LabelList dataKey="Buyer" content={<CustomLabel />} />
//     </Bar>
//     <Bar dataKey="FandC" stackId="stack" fill="#ffc658" barSize={80}>
//       <LabelList dataKey="FandC" content={<CustomLabel />} />
//     </Bar>
//   </BarChart>
// </ResponsiveContainer>

//     </div>
//   );
// };

// export default AnalysisBarChart;
import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  LabelList
} from "recharts";
import dayjs from "dayjs";

interface TableData {
  creationTime: string; // ISO format date
  supplierPendingValue: number;
  buyerPendingValue: number;
  fandCPendingValue: number;
  iscreditnote: boolean;
}

interface AnalysisBarChartProps {
  supplementaryDocStatus: TableData[];
}

const order = ["15", "30", "45", "60", "90", "91+"]; // Fixed X-Axis categories

// Function to get the start of each time bucket dynamically
const categorizeDataByDays = (data: TableData[]) => {
  const today = dayjs();
  const map = new Map<string, { total: number; name: string; Supplier: number; Buyer: number; FandC: number }>();

  // Initialize all categories with 0 values
  order.forEach((bucket) => {
    map.set(bucket, {
      name: bucket,
      total: 0,
      Supplier: 0,
      Buyer: 0,
      FandC: 0
    });
  });

  data.forEach((curr) => {
    const creationDate = dayjs(curr.creationTime);
    const diffDays = today.diff(creationDate, "day");

    let category: string;
    if (diffDays >= 0 && diffDays <= 15) category = "15";
    else if (diffDays > 15 && diffDays <= 30) category = "30";
    else if (diffDays > 30 && diffDays <= 45) category = "45";
    else if (diffDays > 45 && diffDays <= 60) category = "60";
    else if (diffDays > 60 && diffDays <= 90) category = "90";
    else category = "91+";

    const bucket = map.get(category)!;
    bucket.Supplier += curr.supplierPendingValue;
    bucket.Buyer += curr.buyerPendingValue;
    bucket.FandC += curr.fandCPendingValue;
    bucket.total = bucket.Supplier + bucket.Buyer + bucket.FandC;
  });

  return Array.from(map.values());
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload[0].payload.Supplier + payload[0].payload.Buyer + payload[0].payload.FandC;
    return (
      <div style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <p>{`${label} days`}</p>
        <p>{`Total Pending Value: ${total}`}</p>
        <p>{`Supplier: ${payload[0].payload.Supplier}`}</p>
        <p>{`Buyer: ${payload[0].payload.Buyer}`}</p>
        <p>{`FandC: ${payload[0].payload.FandC}`}</p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ x, y, width, height, value }: any) => {
  if (value > 0) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    return (
      <text x={centerX} y={centerY} dominantBaseline="middle" textAnchor="middle" fill="black" fontSize={12}>
        {value}
      </text>
    );
  }
  return null;
};

const AnalysisBarChart: React.FC<AnalysisBarChartProps> = ({ supplementaryDocStatus }) => {
  const filteredData = supplementaryDocStatus.filter(item => !item.iscreditnote);
  const categorizedData = categorizeDataByDays(filteredData);

  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #ddd",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      marginBottom: "20px"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px", fontSize: "18px", fontWeight: "bold" }}>
        Pending Analysis by Days
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={categorizedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          barGap={1}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Bar dataKey="Supplier" stackId="stack" fill="#8884d8" barSize={50}>
            <LabelList dataKey="Supplier" content={<CustomLabel />} />
          </Bar>
          <Bar dataKey="Buyer" stackId="stack" fill="#82ca9d" barSize={50}>
            <LabelList dataKey="Buyer" content={<CustomLabel />} />
          </Bar>
          <Bar dataKey="FandC" stackId="stack" fill="#ffc658" barSize={50}>
            <LabelList dataKey="FandC" content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisBarChart;
