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
  NotSubmitted: "#6c757d",
  Pending: "#ffc107",
  Approved: "#28a745",
  Rejected: "#dc3545",
  Resubmit: "#007bff",
};

interface SupplementaryDocStatus {
  documentStatus: number;
  buyerApprovalStatus: number;
  accountantApprovalStatus: number;
  iscreditnote: boolean;
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

  // Function to get chart data based on status type and credit note flag
  getChartData(statusType: string, iscreditnote: boolean) {
    const statusCounts = {
      NotSubmitted: 0,
      Pending: 0,
      Approved: 0,
      Rejected: 0,
      Resubmit: 0,
    };

    this.props.supplementaryDocStatus.forEach((doc) => {
      if (doc.iscreditnote === iscreditnote) {
        if (statusType === "buyerApproval") {
          switch (doc.buyerApprovalStatus) {
            case 1:
              statusCounts.Pending += 1;
              break;
            case 2:
              statusCounts.Approved += 1;
              break;
            case 3:
              statusCounts.Rejected += 1;
              break;
            default:
              break;
          }
        } else if (statusType === "accountantApproval") {
          switch (doc.accountantApprovalStatus) {
            case 1:
              statusCounts.Pending += 1;
              break;
            case 2:
              statusCounts.Approved += 1;
              break;
            case 3:
              statusCounts.Rejected += 1;
              break;
            default:
              break;
          }
        } else if (statusType === "total") {
          switch (doc.documentStatus) {
            case DocumentStatus.NotSubmitted:
              statusCounts.NotSubmitted += 1;
              break;
            case DocumentStatus.Pending:
              statusCounts.Pending += 1;
              break;
            case DocumentStatus.Approved:
              statusCounts.Approved += 1;
              break;
            case DocumentStatus.Rejected:
              statusCounts.Rejected += 1;
              break;
            case DocumentStatus.Resubmit:
              statusCounts.Resubmit += 1;
              break;
            default:
              break;
          }
        }
      }
    });

    return Object.entries(statusCounts)
      .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] }))
      .filter((item) => item.value > 0); // Remove statuses with zero count
  }
    // Custom label formatter for pie chart
    renderCustomLabel = (props: any) => {
      const { name, value } = props;
      return `${value} - ${name}`;
    };

  renderPieChart(statusType: string, iscreditnote: boolean, chartKey: string,title:string) {
    const chartData = this.getChartData(statusType, iscreditnote);

    // If no data, render an empty pie chart with all values as 0
    if (chartData.length === 0) {
      // Provide a fallback chart with zero values
      chartData.push(
        { name: "NotSubmitted", value: 0, color: STATUS_COLORS.NotSubmitted },
        { name: "Pending", value: 0, color: STATUS_COLORS.Pending },
        { name: "Approved", value: 0, color: STATUS_COLORS.Approved },
        { name: "Rejected", value: 0, color: STATUS_COLORS.Rejected },
        { name: "Resubmit", value: 0, color: STATUS_COLORS.Resubmit }
      );
    }

    return (
      <div style={{ textAlign: "center" }}>
        <h3><b>{title}</b></h3>
      <PieChart width={350} height={350} key={chartKey}>
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
        {/* Supplementary Invoice Pie Charts Row */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <h2><b>Supplementary Invoice</b></h2> {/* Title for Supplementary Invoice Row */}
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {/* Supplementary Invoice Pie Charts (Row 2) */}
          {this.renderPieChart("total", false, "total-supplementary-invoice","Total Supplementary Invoice Status")}
          {this.renderPieChart("buyerApproval", false, "supplementary-invoice-buyer-approval","Buyers Approval")}
          {this.renderPieChart("accountantApproval", false, "supplementary-invoice-accountant-approval","Accounts Approval")}
        </div>
        {/* Credit Note Pie Charts Row */}
        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <h2><b>Credit Note</b></h2> {/* Title for Credit Note Row */}
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          {/* Credit Note Pie Charts (Row 1) */}
          {this.renderPieChart("total", true, "total-credit-note","Total Credit Note Status")}
          {this.renderPieChart("buyerApproval", true, "credit-note-buyer-approval","Buyers Approval")}
          {this.renderPieChart("accountantApproval", true, "credit-note-accountant-approval","Accounts Approval")}

        </div>
      </div>
    );
  }
}

export default AnalysisPieChart;
