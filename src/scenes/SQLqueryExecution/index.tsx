import React, { useState } from "react";
import supplementarySummariesService from "../../services/SupplementarySummaries/supplementarySummariesService";
import { Input, Button, Table, Alert, Spin, Typography } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

const QueryExecutor = () => {
  const [query, setQuery] = useState("");
  const [columns, setColumns] = React.useState<any[]>([]);
  const [data, setData] = React.useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const executeQuery = async () => {
    setColumns([]);
    setData([]);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await supplementarySummariesService.Queryexecution(query);

      if (Array.isArray(response) && response.length > 0) {
        // Handle SELECT queries
        const tableColumns = Object.keys(response[0]).map((key) => ({
          title: key.toUpperCase(),
          dataIndex: key,
          key: key,
        }));
        setColumns(tableColumns);
        setData(response.map((row, index) => ({ key: index, ...row })));
      } else if (typeof response === "object") {
        // Handle INSERT, UPDATE, DELETE queries
        setMessage(`Query executed successfully: ${JSON.stringify(response, null, 2)}`);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError("Failed to execute query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{  maxWidth: "900px"}}>
      <Title level={3}>SQL Query Executor</Title>
      <TextArea
        rows={4}
        placeholder="Enter SQL Query (SELECT, UPDATE, DELETE, etc.)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Button type="primary" onClick={executeQuery} disabled={loading}>
        {loading ? <Spin size="small" /> : "Execute"}
      </Button>

      {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: "10px" }} />}
      {message && <Alert message="Success" description={message} type="success" showIcon style={{ marginTop: "10px" }} />}

      {columns.length > 0 && (
        <Table
          columns={columns}
          dataSource={data}
          bordered
          style={{ marginTop: "20px" }}
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default QueryExecutor;
