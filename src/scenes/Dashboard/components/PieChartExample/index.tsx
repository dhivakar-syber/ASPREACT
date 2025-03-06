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
        let value = Math.abs(doc.total || 0); // Convert negative values to positive
  
        if (statusType === "buyerApproval") {
          switch (doc.buyerApprovalStatus) {
            case 1:
              statusTotals.Pending += value;
              break;
            case 2:
              statusTotals.Approved += value;
              break;
            case 3:
              statusTotals.Rejected += value;
              break;
          }
        } else if (statusType === "accountantApproval") {
          switch (doc.accountantApprovalStatus) {
            case 1:
              statusTotals.Pending += value;
              break;
            case 2:
              statusTotals.Approved += value;
              break;
            case 3:
              statusTotals.Rejected += value;
              break;
          }
        } else if (statusType === "total") {
          if (doc.documentStatus === DocumentStatus.NotSubmitted) {
            // Instead of adding to NotSubmitted, add to Pending
            statusTotals.Pending += value;
          } else {
            switch (doc.documentStatus) {
              case DocumentStatus.Pending:
                statusTotals.Pending += value;
                break;
              case DocumentStatus.Approved:
                statusTotals.Approved += value;
                break;
              case DocumentStatus.Rejected:
                statusTotals.Rejected += value;
                break;
              case DocumentStatus.Resubmit:
                statusTotals.Resubmit += value;
                break;
            }
          }
        }
      }
    });
  
    return Object.entries(statusTotals)
      .map(([name, value]) => ({
        name,
        value,
        color: STATUS_COLORS[name],
      }))
      .filter((item) => item.value > 0);
  }
  
  

  // Custom label formatter for pie chart: displays "TotalValue - Status"
  renderCustomLabel = (props: any) => {
    const { value } = props;
  
    // Determine the appropriate unit (Lakhs or Crores)
    var formattedValue = value/10000000;
    let unit = "Cr"; // Default unit
  
    // If the value is less than 1 lakh, show it in Lakhs
    // if (value < 100000) {
    //   formattedValue = value / 100000; // Convert to Lakhs
    //   unit = "Lakhs";
    // } else {
    //   formattedValue = value / 10000000; // Convert to Crores
    //   // unit = "Crores";
    // }
  
    // Format the value to 2 decimal places
    const formattedValueWithUnit = `${formattedValue.toFixed(2)} ${unit}`;
  
    // Return the formatted label
    return `${formattedValueWithUnit}`;
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
        <h2><b>{title}</b></h2>
        <PieChart width={500} height={500} key={chartKey}>
          <Pie
            dataKey="value"
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={90}
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
      <div
      style={{
        width: "100%",
        overflowX: "auto",
        border: "2px solid #ccc",
        borderRadius: "10px",
        paddingTop: "45px",
      }}
    >
      <div>
        {/* Row title for Supplementary Invoice */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <h1><b>Supplementary Invoice</b></h1>
        </div>
        {/* Supplementary Invoice Pie Charts Row */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          {this.renderPieChart("total", false, "total-supplementary-invoice", "Total Supplementary Invoice Value")}
          {this.renderPieChart("buyerApproval", false, "supplementary-invoice-buyer-approval", "Buyer Approval Value")}
          {this.renderPieChart("accountantApproval", false, "supplementary-invoice-accountant-approval", "Accounts Approval Value")}
        </div>

        {/* Row title for Credit Note */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <h1><b>Credit Note</b></h1>
        </div>
        {/* Credit Note Pie Charts Row */}
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {this.renderPieChart("total", true, "total-credit-note", "Total Credit Note Value")}
          {this.renderPieChart("buyerApproval", true, "credit-note-buyer-approval", "Buyer Approval Value")}
          {this.renderPieChart("accountantApproval", true, "credit-note-accountant-approval", "Accounts Approval Value")}
        </div>
      </div>
      </div>
    );
  }
}

export default AnalysisPieChart;
