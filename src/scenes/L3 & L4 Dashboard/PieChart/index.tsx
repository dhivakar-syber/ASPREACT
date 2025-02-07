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

class AnalysisPieChart extends React.Component<PieChartExampleProps> {
  // Calculate totals for Buyer, Supplier, and FandC
  calculateTotalValues = () => {
    const { supplementaryDocStatus } = this.props;

    let totalBuyer = 0;
    let totalFandC = 0;
    let totalSupplier = 0;

    // Filter out data where iscreditnote is true
    const filteredData = supplementaryDocStatus.filter(item => !item.iscreditnote);

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

export default AnalysisPieChart;
