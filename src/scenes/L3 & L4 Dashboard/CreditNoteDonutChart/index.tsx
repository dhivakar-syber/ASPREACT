import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

interface SupplementaryDocStatus {
  team: string;
  value: number;
  iscreditnote: boolean; // Adding the iscreditnote field
}

interface SupplementaryDocStatusProps {
  supplementaryDocStatus: SupplementaryDocStatus[];
}

class AnalysisDonutChart extends React.Component<SupplementaryDocStatusProps> {
  aggregateData() {
    const { supplementaryDocStatus } = this.props;

    // Filter the data where iscreditnote is false
    const filteredData = supplementaryDocStatus.filter(item => item.iscreditnote);

    // Aggregate the values based on the team
    return filteredData.reduce((acc, curr) => {
      const existingTeam = acc.find((item) => item.team === curr.team);
      if (existingTeam) {
        existingTeam.value += curr.value;
      } else {
        acc.push({ team: curr.team, value: curr.value });
      }
      return acc;
    }, [] as { team: string; value: number }[]);
  }

  render() {
    const aggregatedData = this.aggregateData();

    const COLORS = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
      "#8AC926", "#D7263D", "#6A0572", "#20C997", "#0D6EFD", "#F4A261",
      "#264653", "#E76F51", "#2A9D8F", "#F77F00"
    ];

    return (
      <div style={{
        width: "500px",
        height: "400px",
        border: "2px solid #ccc", // Light gray border
        borderRadius: "10px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <text
              x="10" // Place it towards the left of the container
              y="10" // Adjust for vertical positioning
              textAnchor="start" // Align text to the left
              dominantBaseline="hanging" // Align text to the top
              fontSize="18px"
              fontWeight="bold"
            >
              Team-wise Overall Pending Value
            </text>
            <Pie
              data={aggregatedData}
              dataKey="value"
              nameKey="team"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={60}
              label={({ name, percent }) =>
                `${name}`
              }
            >
              {aggregatedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default AnalysisDonutChart;
