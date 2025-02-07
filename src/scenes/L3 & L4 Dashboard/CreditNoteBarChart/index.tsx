import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TableData {
  team: string;
  supplierPendingValue: number;
  buyerPendingValue: number;
  fandCPendingValue: number;
  iscreditnote: boolean; // Adding the iscreditnote field
}

interface AnalysisBarChartProps {
  supplementaryDocStatus: TableData[];
}

const AnalysisBarChart: React.FC<AnalysisBarChartProps> = ({ supplementaryDocStatus }) => {
  // Filter the data based on iscreditnote = false
  const filteredData = supplementaryDocStatus.filter(item => item.iscreditnote);

  // Aggregate values by team
  const aggregatedData = filteredData.reduce((acc, curr) => {
    // Find if the team already exists in the accumulator
    const existingTeam = acc.find(item => item.name === curr.team);
    
    if (existingTeam) {
      // If team exists, sum up the pending values for each category
      existingTeam.Supplier += curr.supplierPendingValue;
      existingTeam.Buyer += curr.buyerPendingValue;
      existingTeam.FandC += curr.fandCPendingValue;
    } else {
      // Otherwise, add a new entry for the team
      acc.push({
        name: curr.team,
        Supplier: curr.supplierPendingValue,
        Buyer: curr.buyerPendingValue,
        FandC: curr.fandCPendingValue,
      });
    }
    return acc;
  }, [] as { name: string, Supplier: number, Buyer: number, FandC: number }[]);

  // Sort teams by custom order (e.g., TTGI1, TTGI2, ...)
  const sortedData = aggregatedData.sort((a, b) => {
    const numA = parseInt(a.name.replace(/\D/g, ''), 10);
    const numB = parseInt(b.name.replace(/\D/g, ''), 10);
    return numA - numB; // Sort numerically based on the numeric part of the team names
  });

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto', // Enable horizontal scrolling if necessary
        border: '2px solid #ccc',
        borderRadius: '10px',
        paddingTop: '45px',
      }}
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={sortedData} margin={{ top: 40, right: 30, left: 20, bottom: 50 }}>
          {/* Title Positioned at the top-left corner */}
          <text
            x="10"
            y="5"
            textAnchor="start"
            dominantBaseline="hanging"
            fontSize="18px"
            fontWeight="bold"
          >
            Team-wise Pending
          </text>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Supplier" fill="#8884d8" />
          <Bar dataKey="Buyer" fill="#82ca9d" />
          <Bar dataKey="FandC" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisBarChart;
