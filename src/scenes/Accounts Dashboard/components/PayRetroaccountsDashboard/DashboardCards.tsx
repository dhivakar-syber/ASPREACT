import React from "react";
import { Card, Badge, Row, Col } from "antd";
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";
import { AccountDashboardInput } from "./AccountsDashboardInput";

interface DashboardCardsProps {
  AccountDashboardInput: AccountDashboardInput; // Explicitly define expected props
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ AccountDashboardInput }) => {
    const [carddata, setcarddata] = React.useState<any>({});

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await supplementarySummariesService.accounntcarddetails(AccountDashboardInput);
                console.log('Dashboard_card_details', result);
                setcarddata(result.data.result || {});
            } catch (error) {
                console.error("Error fetching supplementary summaries:", error);
            }
        };
        fetchData();
    }, [AccountDashboardInput]);

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
           <b> Cr</b> 
          </div>
        </Card>
      </Col>
    ))}
  </Row>    
</div>
    );
};

export default DashboardCards;
