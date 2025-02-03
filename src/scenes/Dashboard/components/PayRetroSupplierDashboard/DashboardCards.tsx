import React from "react";
import { Badge, Row, Col } from "antd";
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";
import { SupplierDashboardInput } from "./SupplierDashboardInput";

interface DashboardCardsProps {
    SupplierDashboardInputs: SupplierDashboardInput; // Explicitly define expected props
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ SupplierDashboardInputs }) => {
    const [carddata, setcarddata] = React.useState<any>({});

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await supplementarySummariesService.carddetails(SupplierDashboardInputs);
                console.log('Dashboard_card_details', result);
                setcarddata(result.data.result || {});
            } catch (error) {
                console.error("Error fetching supplementary summaries:", error);
            }
        };
        fetchData();
    }, [SupplierDashboardInputs]);

    const cardDetails = [
        { key: "totalInvoicePending", title: "Pending Supplementary Invoice" },
        { key: "totalCreditNotesPending", title: "Pending Credit Notes" },
        { key: "totalqueryraised", title: "Query Raised - Active" },
    ];

    return (
        <div style={{ padding: "10px"}}>
   <Row gutter={16}>
      {cardDetails.map((card, index) => (
        <Col key={index} span={7}>
          <div style={{ height:"85px", backgroundColor: "#fafafa", marginLeft:"20px", marginRight:"20px"  , borderRadius:"2px" }}>
            
            <Row>
            <Col span={16}>
          
                <div className="card-content" style={{ paddingTop:"22px", textAlign: "left", marginLeft:"10px" }}>
                  <Badge
                    count={
                      card.key === "totalqueryraised"
                        ? (carddata[card.key] === 0 ? 0 : carddata[card.key]) // If 0, show 0, otherwise show the value
                        : (carddata[card.key] !== undefined && carddata[card.key] !== null ? carddata[card.key].toFixed(2) : 0) // Format other keys to 2 decimal places, default to 0 if null/undefined
                    }
                    style={{
                      backgroundColor: "#fafafa",
                      fontSize: "27px",
                      // padding: "0px",
                      margin:"0px",
                      color: "#6EA046",
                    }}
                    showZero
                  />
                  {card.key !== "totalqueryraised" && <span> Cr </span>} {/* Only add 'Cr' for other keys */}
                </div>

                <div className="card-title" style={{marginLeft:"10px", paddingTop:"6px", fontSize:"10px", color:"#444444", textAlign: "left" }}>
                  <span>{card.title}</span>
                </div>
            </Col>
            <Col span={6}>
                <div className="card-icon" style={{ paddingTop:"14px", textAlign: "right" }}>
                  <img width={45} src={require(`../../../../images/${card.key}.png`)} alt={card.key} />
                </div>
            </Col>
            </Row>
          </div>
          
        </Col>
      ))}
      <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", position: "relative", right: '-2rem', top: 0}}>
                  <div className="col-1 status">
                    <div className="progress-dot">
                      <span className="dot approved"></span>
                      <div className="status-text" style={{ marginRight: "1px" }}>
                        Approved
                      </div>
                    </div>
                    <div className="progress-dot">
                    <span className="dot pending"></span>
                      <div className="status-text" style={{ marginRight: "10px" }}>
                        Pending
                      </div>
                    </div>

                    <div className="progress-dot">
                    <span className="dot rejected"></span>
                      <div className="status-text" style={{ marginRight: "5px" }}>
                        Rejected
                      </div>
                    </div>
                  </div>
                </Col>
    </Row>    
</div>
    );
};

export default DashboardCards;
