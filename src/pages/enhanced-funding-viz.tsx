import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card.tsx';
import { Button } from '../components/ui/button.tsx';
import { Badge } from '../components/ui/badge.tsx';
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Calendar, Download, Filter } from 'lucide-react';

type FundingResource = {
  uploaded_at: string;
  amount: number;
};

type SuccessStory = {
  title: string;
  description: string;
  amount: number;
};

const API_BASE_URL = 'http://localhost:5000';
const API_ENDPOINTS = {
  fundingStats: '/api/funding/statistics',
  successStories: '/api/funding/success-stories',
  visualizeEvents: '/visualize-events',
  visualizeFunding: '/visualize-funding'
};

const FundingVisualization: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('6M');
  const [fundingData, setFundingData] = useState<FundingResource[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<{ label: string; value: string }[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFundingData();
    fetchSuccessStories();
  }, [timeRange]);

  const fetchFundingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.fundingStats}?timeRange=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch funding data');
      const data = await response.json();
      
      setFundingData(data.fundingResources);
      setChartData(processMonthlyData(data.fundingResources));
      setStatsData(calculateStats(data.fundingResources));
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching funding data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuccessStories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.successStories}`);
      if (!response.ok) throw new Error('Failed to fetch success stories');
      const data = await response.json();
      setSuccessStories(data);
    } catch (err: any) {
      console.error('Error fetching success stories:', err);
    }
  };

  const processMonthlyData = (resources: FundingResource[]) => {
    const monthlyAggregated = resources.reduce<Record<string, { month: string; totalAmount: number; count: number }>>((acc, resource) => {
      const month = new Date(resource.uploaded_at).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = {
          month,
          totalAmount: 0,
          count: 0,
        };
      }
      acc[month].totalAmount += resource.amount;
      acc[month].count += 1;
      return acc;
    }, {});

    return Object.values(monthlyAggregated).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
  };

  const calculateStats = (resources: FundingResource[]) => {
    const total = resources.reduce((sum, resource) => sum + resource.amount, 0);
    const average = total / resources.length;
    const maxFunding = Math.max(...resources.map(r => r.amount));
    
    return [
      { label: 'Total Funding', value: `$${total.toLocaleString()}` },
      { label: 'Average Grant', value: `$${average.toLocaleString()}` },
      { label: 'Largest Grant', value: `$${maxFunding.toLocaleString()}` },
      { label: 'Total Projects', value: resources.length.toString() }
    ];
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
            onClick={() => handleTimeRangeChange('6M')}
          >
            6 Months
          </Button>
          <Button
            variant={timeRange === '1Y' ? 'default' : 'outline'}
            onClick={() => handleTimeRangeChange('1Y')}
          >
            1 Year
          </Button>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
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
                <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" name="Funding Amount" />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Number of Grants" />
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
              {successStories.map((story, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{story.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{story.description}</p>
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
