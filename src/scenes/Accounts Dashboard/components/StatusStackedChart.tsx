import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Button, Card, Spin } from 'antd';
import supplementarySummariesService from '../../../services/SupplementarySummaries/supplementarySummariesService';

interface DataItem {
  ageBucket: string;
  pending: number;
  approved: number;
  rejected: number;
}

const defaultBuckets: string[] = [
  '0-15 Days',
  '16-30 Days',
  '31-40 Days',
  '41-60 Days',
  '61-90 Days',
  'Above 90 Days'
];

const StackedBarChart: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await supplementarySummariesService.getAllAnalysisValue();

      const rawData = response ?? [];

      // Convert to map for easy lookup
      const dataMap = new Map<string, DataItem>(
        rawData.map((item: any) => [
          item.ageBucket,
          {
            ageBucket: item.ageBucket,
            pending: item.pending,
            approved: item.approved,
            rejected: item.rejected
          }
        ])
      );

      // Ensure all default buckets are present
      const filledData: DataItem[] = defaultBuckets.map((bucket) => ({
        ageBucket: bucket,
        pending: dataMap.get(bucket)?.pending || 0,
        approved: dataMap.get(bucket)?.approved || 0,
        rejected: dataMap.get(bucket)?.rejected || 0
      }));

      setData(filledData);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Card title="Aging Bucket Chart" extra={<Button onClick={loadData}>Reload</Button>}>
      <div style={{ width: '100%', height: 400 }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}barSize={80}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageBucket" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" stackId="a" fill="#FFFF40" name="Pending" />
              <Bar dataKey="approved" stackId="a" fill="#6EA046" name="Approved" />
              <Bar dataKey="rejected" stackId="a" fill="#FF0000" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default StackedBarChart;