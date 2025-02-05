import * as React from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

// Enum for document status
enum DocumentStatus {
  NotSubmitted = 0,
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Resubmit = 4,
}

// Define color mapping for each status
const STATUS_COLORS: { [key: string]: string } = {
  NotSubmitted: "#6c757d", // Grey
  Pending: "#ffc107",      // Yellow
  Approved: "#28a745",     // Green
  Rejected: "#dc3545",     // Red
  Resubmit: "#007bff",     // Blue
};

interface SupplementaryDocStatus {
  documentStatus: number;
  buyerApprovalStatus: number;
  accountantApprovalStatus: number;
  iscreditnote: boolean;
  total: number;
}

interface SupplementaryDocStatusProps {
  supplementaryDocStatus: SupplementaryDocStatus[];
}

class AnalysisPieChart extends React.Component<SupplementaryDocStatusProps> {
  state = {
    activeIndex: 0,
  };

  onPieEnter = (_: any, index: number) => {
    this.setState({ activeIndex: index });
  };

  // Function to get chart data based on status type and iscreditnote flag.
  // Instead of incrementing counts by 1, we sum up the 'total' value.
  getChartData(statusType: string, iscreditnote: boolean) {
    const statusTotals = {
      NotSubmitted: 0,
      Pending: 0,
      Approved: 0,
      Rejected: 0,
      Resubmit: 0,
    };

    this.props.supplementaryDocStatus.forEach((doc) => {
      if (doc.iscreditnote === iscreditnote) {
        if (statusType === "buyerApproval") {
          // Sum totals based on buyer approval status
          switch (doc.buyerApprovalStatus) {
            case 1:
              statusTotals.Pending += doc.total || 0;
              break;
            case 2:
              statusTotals.Approved += doc.total || 0;
              break;
            case 3:
              statusTotals.Rejected += doc.total || 0;
              break;
            default:
              break;
          }
        } else if (statusType === "accountantApproval") {
          // Sum totals based on accountant approval status
          switch (doc.accountantApprovalStatus) {
            case 1:
              statusTotals.Pending += doc.total || 0;
              break;
            case 2:
              statusTotals.Approved += doc.total || 0;
              break;
            case 3:
              statusTotals.Rejected += doc.total || 0;
              break;
            default:
              break;
          }
        } else if (statusType === "total") {
          // Sum totals based on overall document status
          switch (doc.documentStatus) {
            case DocumentStatus.NotSubmitted:
              statusTotals.NotSubmitted += doc.total || 0;
              break;
            case DocumentStatus.Pending:
              statusTotals.Pending += doc.total || 0;
              break;
            case DocumentStatus.Approved:
              statusTotals.Approved += doc.total || 0;
              break;
            case DocumentStatus.Rejected:
              statusTotals.Rejected += doc.total || 0;
              break;
            case DocumentStatus.Resubmit:
              statusTotals.Resubmit += doc.total || 0;
              break;
            default:
              break;
          }
        }
      }
    });
    // const totalSum = Object.values(statusTotals).reduce((sum, val) => sum + val, 0);
    return Object.entries(statusTotals)
    .map(([name, value]) => ({
      name,
      value, // Keep the raw value instead of converting it to a percentage
      color: STATUS_COLORS[name],
    }))
    .filter((item) => item.value > 0); // Remove items with zero value
  
  
  }  

  // Custom label formatter for pie chart: displays "TotalValue - Status"
  renderCustomLabel = (props: any) => {
    const { name, value } = props;
  
    // Determine the appropriate unit (Lakhs or Crores)
    let formattedValue = value;
    let unit = "Crores"; // Default unit
  
    // If the value is less than 1 lakh, show it in Lakhs
    if (value < 100000) {
      formattedValue = value / 100000; // Convert to Lakhs
      unit = "Lakhs";
    } else {
      formattedValue = value / 10000000; // Convert to Crores
    }
  
    // Format the value to 2 decimal places
    const formattedValueWithUnit = `${formattedValue.toFixed(2)} ${unit}`;
  
    // Return the formatted label
    return `${formattedValueWithUnit} - ${name}`;
  };
  
  

  renderPieChart(statusType: string, iscreditnote: boolean, chartKey: string, title: string) {
    let chartData = this.getChartData(statusType, iscreditnote);

    // If no data exists, provide a fallback with zeros (so an empty pie chart appears)
    if (chartData.length === 0) {
      chartData = [
        { name: "NotSubmitted", value: 0, color: STATUS_COLORS.NotSubmitted },
        { name: "Pending", value: 0, color: STATUS_COLORS.Pending },
        { name: "Approved", value: 0, color: STATUS_COLORS.Approved },
        { name: "Rejected", value: 0, color: STATUS_COLORS.Rejected },
        { name: "Resubmit", value: 0, color: STATUS_COLORS.Resubmit },
      ];
    }

    return (
      <div style={{ textAlign: "center" }}>
        <h3><b>{title}</b></h3>
        <PieChart width={500} height={500} key={chartKey}>
          <Pie
            dataKey="value"
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={this.renderCustomLabel}
            onMouseEnter={this.onPieEnter}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* Row title for Supplementary Invoice */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <h2><b>Supplementary Invoice</b></h2>
        </div>
        {/* Supplementary Invoice Pie Charts Row */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          {this.renderPieChart("total", false, "total-supplementary-invoice", "Total Supplementary Invoice Value")}
          {this.renderPieChart("buyerApproval", false, "supplementary-invoice-buyer-approval", "Buyer Approval Value")}
          {this.renderPieChart("accountantApproval", false, "supplementary-invoice-accountant-approval", "Accounts Approval Value")}
        </div>

        {/* Row title for Credit Note */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <h2><b>Credit Note</b></h2>
        </div>
        {/* Credit Note Pie Charts Row */}
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {this.renderPieChart("total", true, "total-credit-note", "Total Credit Note Value")}
          {this.renderPieChart("buyerApproval", true, "credit-note-buyer-approval", "Buyer Approval Value")}
          {this.renderPieChart("accountantApproval", true, "credit-note-accountant-approval", "Accounts Approval Value")}
        </div>
      </div>
    );
  }
}

export default AnalysisPieChart;
