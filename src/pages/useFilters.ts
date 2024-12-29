import { useState } from 'react';
import { FilterOptions } from './types';
export const useFilters = () => {
    const [filters, setFilters] = useState<FilterOptions>({
      type: 'All Types',
      duration: 'Any Duration',
      rating: 'Any Rating'
    });
    const [showFilters, setShowFilters] = useState(false);
  
    const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    };
  
    const toggleFilters = () => setShowFilters(!showFilters);
  
    return {
      filters,
      showFilters,
      handleFilterChange,
      toggleFilters
    };
  };