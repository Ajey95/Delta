import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card.tsx';
import { Button } from '../components/ui/button.tsx';
import { Badge } from '../components/ui/badge.tsx';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Download } from 'lucide-react';

interface FundingData {
  data_points: Array<{
    date: string;
    amount: number;
    category: string;
  }>;
  total_amount: number;
  count: number;
  average: number;
}

interface SuccessStory {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const FundingVisualization: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('6M');
  const [fundingData, setFundingData] = useState<FundingData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<{ label: string; value: string }[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchFundingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/funding/statistics?timeRange=${timeRange}`,
        { headers: getAuthHeaders() }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch funding data');
      }
      
      const data: FundingData = await response.json();
      console.log('Received funding data:', data); // Debug log
      
      setFundingData(data);
      setChartData(processMonthlyData(data.data_points));
      setStatsData(calculateStats(data)); // Using the new calculateStats function
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching funding data:', err);
      // Set default values on error
      setStatsData(calculateStats(null));
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: FundingData | null) => {
    if (!data || !data.data_points || data.data_points.length === 0) {
      return [
        { label: 'Total Funding', value: '$0' },
        { label: 'Average Grant', value: '$0' },
        { label: 'Total Projects', value: '0' },
        { label: 'Success Rate', value: '0%' }
      ];
    }
  
    const totalAmount = data.total_amount || 0;
    const count = data.count || 0;
    const average = count > 0 ? totalAmount / count : 0;
    const successRate = count > 0 ? (data.data_points.length / count * 100) : 0;
  
    return [
      { label: 'Total Funding', value: `$${totalAmount.toLocaleString()}` },
      { label: 'Average Grant', value: `$${average.toLocaleString()}` },
      { label: 'Total Projects', value: count.toString() },
      { label: 'Success Rate', value: `${successRate.toFixed(1)}%` }
    ];
  };
  

  const fetchSuccessStories = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/funding/success-stories`,
        { headers: getAuthHeaders() }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch success stories');
      }
      
      const data: SuccessStory[] = await response.json();
      setSuccessStories(data);
    } catch (err) {
      console.error('Error fetching success stories:', err);
    }
  };

  useEffect(() => {
    fetchFundingData();
    fetchSuccessStories();
  }, [timeRange]);

  const processMonthlyData = (dataPoints: FundingData['data_points']) => {
    if (!dataPoints || dataPoints.length === 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const lastTwelveMonths = Array.from({ length: 12 }, (_, i) => {
        const monthIndex = (currentMonth - i + 12) % 12;
        return {
          month: months[monthIndex],
          totalAmount: 0,
          count: 0
        };
      }).reverse();
      return lastTwelveMonths;
    }
    
    const startDate = new Date(dataPoints[0].date);
    const endDate = new Date(dataPoints[dataPoints.length - 1].date);
    const months: Record<string, { month: string; totalAmount: number; count: number }> = {};
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthKey = currentDate.toLocaleString('default', { month: 'short' });
      months[monthKey] = { month: monthKey, totalAmount: 0, count: 0 };
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

  // Fill in actual data
      dataPoints.forEach(point => {
        const month = new Date(point.date).toLocaleString('default', { month: 'short' });
        if (months[month]) {
          months[month].totalAmount += point.amount;
          months[month].count += 1;
        }
      });
      // const monthlyData = dataPoints.reduce<Record<string, { month: string; totalAmount: number; count: number }>>(
      //   (acc, point) => {
      //     const month = new Date(point.date).toLocaleString('default', { month: 'short' });
      //     if (!acc[month]) {
      //       acc[month] = { month, totalAmount: 0, count: 0 };
      //     }
      //     acc[month].totalAmount += point.amount;
      //     acc[month].count += 1;
      //     return acc;
      //   },
      //   {}
      // );

      // Convert to array and sort
      // const calculateStats = (data: FundingData) => {
      //   if (!data || !data.data_points || data.data_points.length === 0) {
      //     return [
      //       { label: 'Total Funding', value: '$0' },
      //       { label: 'Average Grant', value: '$0' },
      //       { label: 'Total Projects', value: '0' },
      //       { label: 'Success Rate', value: '0%' }
      //     ];
      //   }
      
      //   const totalAmount = data.total_amount || 0;
      //   const count = data.count || 0;
      //   const average = count > 0 ? totalAmount / count : 0;
      //   const successRate = count > 0 ? (data.data_points.length / count * 100) : 0;
      
      //   return [
      //     { label: 'Total Funding', value: `$${totalAmount.toLocaleString()}` },
      //     { label: 'Average Grant', value: `$${average.toLocaleString()}` },
      //     { label: 'Total Projects', value: count.toString() },
      //     { label: 'Success Rate', value: `${successRate.toFixed(1)}%` }
      //   ];
      // };
      return Object.values(months).sort((a, b) => {
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });
  };
  
  
  const handleExportData = async () => {
    if (!fundingData) return;
    
    const csvContent = [
      ['Date', 'Amount', 'Category'],
      ...fundingData.data_points.map(point => [
        point.date,
        point.amount.toString(),
        point.category
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `funding-data-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button
            variant={timeRange === '6M' ? 'default' : 'outline'}
            onClick={() => setTimeRange('6M')}
          >
            6 Months
          </Button>
          <Button
            variant={timeRange === '1Y' ? 'default' : 'outline'}
            onClick={() => setTimeRange('1Y')}
          >
            1 Year
          </Button>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExportData}
        >
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Funding Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalAmount" 
                  stroke="#8884d8" 
                  name="Funding Amount"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#82ca9d" 
                  name="Number of Grants"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Funding Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            {statsData.map((stat, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
        </Card>
      </div>

      {successStories.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Success Stories</h3>
            <div className="space-y-4">
              {successStories.map((story) => (
                <div key={story.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{story.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{story.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(story.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="secondary">${story.amount.toLocaleString()}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FundingVisualization;