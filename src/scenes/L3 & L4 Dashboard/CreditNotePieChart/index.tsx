import * as React from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

// Define the structure of the data
interface TableData {
  buyerPendingValue: number;
  fandCPendingValue: number;
  supplierPendingValue: number;
  iscreditnote: boolean; // Adding the iscreditnote field
}

interface PieChartExampleProps {
  supplementaryDocStatus: TableData[];
}

class AnalysisCreditNotePieChart extends React.Component<PieChartExampleProps> {
  // Calculate totals for Buyer, Supplier, and FandC
  calculateTotalValues = () => {
    const { supplementaryDocStatus } = this.props;

    let totalBuyer = 0;
    let totalFandC = 0;
    let totalSupplier = 0;

    // Filter out data where iscreditnote is true
    const filteredData = supplementaryDocStatus.filter(item => item.iscreditnote);
    console.log(filteredData)
    // If there is no valid data, return an empty array to prevent rendering
    if (filteredData.length === 0) {
      return [];
    }

    // Sum the values for each category
    filteredData.forEach(item => {
      totalBuyer += item.buyerPendingValue;
      totalFandC += item.fandCPendingValue;
      totalSupplier += item.supplierPendingValue;
    });

    return [
      { name: 'Buyer', value: totalBuyer },
      { name: 'FandC', value: totalFandC },
      { name: 'Supplier', value: totalSupplier }
    ];
  }

  render() {
    const data = this.calculateTotalValues();

    // // If no data is available, render a message instead of the pie chart
    // if (data.length === 0) {
    //   return <div>No data available for creditNote = true.</div>;
    // }

    // Colors for the pie chart segments
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

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
        <PieChart width={300} height={300}>
          <text
            x="10" // Place it towards the left of the container
            y="5" // Adjust for vertical positioning
            textAnchor="start" // Align text to the left
            dominantBaseline="hanging" // Align text to the top
            fontSize="18px"
            fontWeight="bold"
          >
            Overall Pending Value
          </text>
          <Pie
            dataKey="value"
            data={data}
            cx={150}
            cy={150}
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    );
  }
}

export default AnalysisCreditNotePieChart;
