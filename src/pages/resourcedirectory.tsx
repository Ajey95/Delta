import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  Download,
  Share2,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const API_BASE_URL = 'http://localhost:5000';
const API_ENDPOINTS = {
  categories: '/api/categories',
  stats: '/api/stats',
  resources: '/api/resources',
  search: '/search'
};

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string;
  rating?: number;
  duration?: string;
  members?: number;
}

interface Stats {
  [key: string]: number;
}

const ResourceDirectory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: 'All Types',
    duration: 'Any Duration',
    rating: 'Any Rating'
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.categories}`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data: string[] = await response.json();
        setCategories(['All', ...data]);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.stats}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data: Stats = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  // Fetch resources with filters
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          category: selectedCategory !== 'All' ? selectedCategory : '',
          search: searchQuery,
          type: filters.type !== 'All Types' ? filters.type : '',
          duration: filters.duration !== 'Any Duration' ? filters.duration : '',
          rating: filters.rating !== 'Any Rating' ? filters.rating : ''
        });

        const url = searchQuery
          ? `${API_BASE_URL}${API_ENDPOINTS.search}?query=${searchQuery}`
          : `${API_BASE_URL}${API_ENDPOINTS.resources}?${queryParams}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch resources');
        const data = await response.json();
        setResources(searchQuery ? data.results : data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching resources:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResources, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchQuery, filters]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const renderResourceCard = (resource: Resource) => {
    return (
      <Card key={resource.id} className="mb-4">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{resource.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{resource.category}</Badge>
                {resource.tags?.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline">{tag.trim()}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <BookOpen className="h-4 w-4 mr-1" />
                View
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            {resource.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                {resource.rating}/5
              </div>
            )}
            {resource.duration && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {resource.duration}
              </div>
            )}
            {resource.members && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {resource.members} members
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="p-6">
              <h3 className="text-sm text-gray-600">{key}</h3>
              <p className="text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            variant="outline"
            onClick={toggleFilters}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option>All Types</option>
                  <option>Course</option>
                  <option>Workshop</option>
                  <option>Mentorship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                >
                  <option>Any Duration</option>
                  <option>Short Term</option>
                  <option>Medium Term</option>
                  <option>Long Term</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                >
                  <option>Any Rating</option>
                  <option>4+ Stars</option>
                  <option>3+ Stars</option>
                  <option>2+ Stars</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resources List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <div className="space-y-4">
          {resources.map(renderResourceCard)}
        </div>
      )}
    </div>
  );
};

export default ResourceDirectory;
