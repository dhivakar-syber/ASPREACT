import React, { useState } from "react";
import supplementarySummariesService from "../../services/SupplementarySummaries/supplementarySummariesService";
import { Input, Button, Table, Alert, Spin, Typography } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

const QueryExecutor = () => {
  const [query, setQuery] = useState("");
  const [columns, setColumns] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const highlightSQL = (query: string) => {
  //   const keywords =
  //     /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|DELETE|JOIN|ON|ORDER BY|GROUP BY|HAVING|AND|OR|NOT|LIKE|IN|AS|DISTINCT|CASE|WHEN|THEN|ELSE|END|LIMIT|OFFSET)\b/gi;
  //   return query.replace(
  //     keywords,
  //     (match) => `<span class="sql-keyword">${match}</span>`
  //   );
  // };

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
    } catch (error) {
      setError("Failed to execute query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <Title level={3}>SQL Query Executor</Title>
      <TextArea
        rows={4}
        placeholder="Enter SQL Query (SELECT, UPDATE, DELETE, etc.)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      {/* <div
        dangerouslySetInnerHTML={{ __html: highlightSQL(query) }}
        style={{
          minHeight: "50px",
          border: "1px solid #d9d9d9",
          padding: "5px",
          marginBottom: "10px",
          background: "#f5f5f5",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
      /> */}
      <Button type="primary" onClick={executeQuery} disabled={loading}>
        {loading ? <Spin size="small" /> : "Execute"}
      </Button>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginTop: "10px" }}
        />
      )}
      {message && (
        <Alert
          message="Success"
          description={message}
          type="success"
          showIcon
          style={{ marginTop: "10px" }}
        />
      )}

      {columns.length > 0 && (
        <div style={{ width: "1500px", overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          
          pagination={{ pageSize: 15 }}
          
        />
      </div>
      )}
    </div>
  );
};

export default QueryExecutor;
