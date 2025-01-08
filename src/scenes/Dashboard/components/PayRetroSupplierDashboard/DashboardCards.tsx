import React from "react";
import { Card, Badge, Row, Col } from "antd";
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
                count={((carddata[card.key] || 0).toFixed(2))}
                style={{ backgroundColor: "#006780", fontSize: "12px", padding: "0 8px" }}
              />
              
            </div>
          </Card>
        </Col>
      ))}
    </Row>    
</div>
    );
};

export default DashboardCards;
