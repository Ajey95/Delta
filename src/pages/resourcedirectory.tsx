import React, { useState, ChangeEvent } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  Share2,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useCategories } from './useCategories';
import { useResources } from './useResources';
import { useStats } from './useStats';
import { useFilters } from './useFilters';
import { Resource, Stats } from './types';
import { FilterOptions } from './types';



// Components
const StatsSection: React.FC<{ stats: Record<string, number> }> = ({ stats }) => (
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
);

import ResourceCard from './Resourcecard';

const FilterSection: React.FC<{
  filters: any;
  onFilterChange: (type: keyof FilterOptions, value: string) => void;
}> = ({ filters, onFilterChange }) => (
  <Card>
    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: 'Type', options: ['All Types', 'Course', 'Workshop', 'Mentorship'] },
        { label: 'Duration', options: ['Any Duration', 'Short Term', 'Medium Term', 'Long Term'] },
        { label: 'Rating', options: ['Any Rating', '4+ Stars', '3+ Stars', '2+ Stars'] }
      ].map(({ label, options }) => (
        <div key={label}>
          <label className="block text-sm font-medium mb-2">{label}</label>
          <select
            className="w-full border rounded-lg p-2"
            value={filters[label.toLowerCase()]}
            onChange={(e) => onFilterChange(label.toLowerCase() as keyof FilterOptions, e.target.value)}
          >
            {options.map(option => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      ))}
    </CardContent>
  </Card>
);

const ResourceDirectory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { categories, error: categoriesError } = useCategories();
  const { stats, error: statsError } = useStats();
  const { filters, showFilters, handleFilterChange, toggleFilters } = useFilters();
  const { resources, isLoading, error: resourcesError } = useResources(
    selectedCategory,
    searchQuery,
    filters
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (categoriesError || statsError || resourcesError) {
    return (
      <div className="text-red-500 text-center p-4">
        {categoriesError || statsError || resourcesError}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <StatsSection stats={stats} />

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

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {showFilters && (
          <FilterSection
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceDirectory;