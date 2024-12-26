import * as React from "react";
import supplementarySummariesService from '../../../../services/SupplementarySummaries/supplementarySummariesService'
import {SupplierDashboardInput} from '../PayRetroSupplierDashboard/DashboardInput'

// const tableData = [
//   {
//     id: 157,
//     buyer: "Thisanth Thiyagaraj",
//     partNo: "A4001300215 - 6",
//     reportDate: "20-12-2024",
//     ageing: 5,
//     action: "⚙️",
//     date: "02-04-2024",
//     from: "02-04-2024",
//     to: "30-06-2024",
//     value: "6848.04",
//     supplier: "0.01 Cr",
//     buyerValue: "0.00 Cr",
//     fc: "0.00 Cr",
//   },
//   {
//     id: 158,
//     buyer: "Thisanth Thiyagaraj",
//     partNo: "A4001301715 - 6",
//     reportDate: "20-12-2024",
//     ageing: 5,
//     action: "⚙️",
//     date: "02-04-2024",
//     from: "02-04-2024",
//     to: "30-06-2024",
//     value: "19816.8",
//     supplier: "0.01 Cr",
//     buyerValue: "0.00 Cr",
//     fc: "0.00 Cr",
//   },
//   {
//     id: 158,
//     buyer: "Thisanth Thiyagaraj",
//     partNo: "A4001301715 - 6",
//     reportDate: "20-12-2024",
//     ageing: 5,
//     action: "⚙️",
//     date: "02-04-2024",
//     from: "02-04-2024",
//     to: "30-06-2024",
//     value: "19816.8",
//     supplier: "0.01 Cr",
//     buyerValue: "0.00 Cr",
//     fc: "0.00 Cr",
//   },
//   {
//     id: 158,
//     buyer: "Thisanth Thiyagaraj",
//     partNo: "A4001301715 - 6",
//     reportDate: "20-12-2024",
//     ageing: 5,
//     action: "⚙️",
//     date: "02-04-2024",
//     from: "02-04-2024",
//     to: "30-06-2024",
//     value: "19816.8",
//     supplier: "0.01 Cr",
//     buyerValue: "0.00 Cr",
//     fc: "0.00 Cr",
//   },
// ];

const PayRetroSupplierDashboard: React.SFC = () => {
  const [tableData, setTableData] = React.useState<any[]>([]); 
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null);

  
  React.useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const result = await supplementarySummariesService.loadsupplementarySummary();
        setTableData(result.data.result || []); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching supplementary summaries:", error);
      }
    };

    fetchData();
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".dropdown-container")) {
      setOpenDropdownId(null); // Close dropdown when clicking outside
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id: number) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id)); // Toggle dropdown
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px", color: "#333" }}>Dashboard</h1>

      <div style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "20px", color: "#555" }}>Supplementary Data</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Buyer</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Part No - Version</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Report Date</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Ageing</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Action</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Date</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>From</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>To</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Value</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Supplier</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Buyer</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>F&C</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id} style={{ backgroundColor: row.id % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.buyer}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.partNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.reportDate}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.ageing}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                  <div className="dropdown-container" style={{ position: "relative" }}>
                    <button
                      style={{
                        backgroundColor: "#005f7f",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleDropdown(row.id)}
                    >
                      {row.action}
                    </button>
                    {openDropdownId === row.id && (
  <div
    style={{
      position: "absolute",
      top: "100%",
      left: "0",
      backgroundColor: "#fff",
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      border: "1px solid #ddd",
      zIndex: 1000,
      minWidth: "200px", // Adjust this value to increase dropdown width
    }}
  >
    <ul style={{ listStyle: "none", margin: 0, padding: "10px" }}>
      <li style={{ padding: "5px", cursor: "pointer" }}>Upload Supplementary Details</li>
      <li style={{ padding: "5px", cursor: "pointer" }}>Submit</li>
    </ul>
  </div>
)}
                  </div>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.date}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.from}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.to}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "right" }}>{row.value}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.supplier}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.buyerValue}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.fc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayRetroSupplierDashboard;
