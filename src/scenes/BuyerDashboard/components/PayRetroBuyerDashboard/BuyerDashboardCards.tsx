import React from "react";
import { Badge, Row, Col } from "antd";
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";
import { BuyerDashboardInput } from "./BuyerDashboardInput";

interface DashboardCardsProps {
    BuyerDashboardinputs: BuyerDashboardInput; // Explicitly define expected props
}

const BuyerDashboardCards: React.FC<DashboardCardsProps> = ({ BuyerDashboardinputs }) => {
    const [carddata, setcarddata] = React.useState<any>({});

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await supplementarySummariesService.Buyerdashboardcarddetails(BuyerDashboardinputs);
                console.log('Dashboard_card_details', result);
                setcarddata(result.data.result || {});
            } catch (error) {
                console.error("Error fetching supplementary summaries:", error);
            }
        };
        fetchData();
    }, [BuyerDashboardinputs]);

    const cardDetails = [
        { key: "totalInvoicePending", title: "Pending Supplementary Invoice" },
        { key: "totalCreditNotesPending", title: "Pending Credit Notes" },
        { key: "totalqueryraised", title: "Query Raised - Active" },
    ];

    return (
            <div style={{ padding: "10px"}}>
       <Row gutter={16}>
          {cardDetails.map((card, index) => (
            <Col key={index} span={8}>
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
                          fontSize: "28px",
                          padding: "0px",
                          margin:"0px",
                          color: "#6EA046",
                        }}
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
        </Row>    
    </div>
        );
};

export default BuyerDashboardCards;
