import React from "react";
import { Card, Badge, Row, Col } from "antd";
import supplementarySummariesService from "./../../services/SupplementarySummaries/supplementarySummariesService";
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
                //console.log('Dashboard_card_details', result);
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
        <div className="site-card-wrapper">
  <Row gutter={16}>
    {cardDetails.map((card, index) => (
      <Col key={index} span={8}>
        <Card
          title={card.title}
          bordered={true}
          className="custom-card"
          style={{ backgroundColor: "#e6f7ff" }}
        >
                <div className="card-content" style={{ textAlign: "center" }}>
                  <Badge
                    count={
                      card.key === "totalqueryraised"
                        ? (carddata[card.key] === 0 ? 0 : carddata[card.key]) // If 0, show 0, otherwise show the value
                        : (carddata[card.key] !== undefined && carddata[card.key] !== null ? carddata[card.key].toFixed(2) : 0) // Format other keys to 2 decimal places, default to 0 if null/undefined
                    }
                    style={{
                      backgroundColor: "#006780",
                      fontSize: "12px",
                      padding: "0 8px",
                    }}
                  />
                  {card.key !== "totalqueryraised" && <b> Cr</b>} {/* Only add 'Cr' for other keys */}
                </div>
        </Card>
      </Col>
    ))}
  </Row>    
</div>
    );
};

export default BuyerDashboardCards;
