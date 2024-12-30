// components/ResourceList.tsx
import React, { useState } from 'react';
import { useCombinedResources } from '../pages/useResources';
import { FilterOptions } from '../pages/types';

export const ResourceList: React.FC = () => {
    // State for filters
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filters, setFilters] = useState<FilterOptions>({
        type: 'All Types',
        duration: 'Any Duration',
        rating: 'Any Rating'
    });

    // Use the hook with the required parameters
    const { resources, isLoading, error } = useCombinedResources(selectedCategory, searchQuery, filters);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Search and filter controls */}
            <div className="filters space-y-4">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {/* Type filter */}
                <select
                    className="w-full border rounded-lg p-2"
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({
                        ...prev,
                        type: e.target.value
                    }))}
                >
                    <option>All Types</option>
                    <option>Course</option>
                    <option>Workshop</option>
                    <option>Mentorship</option>
                </select>

                {/* Duration filter */}
                <select
                    className="w-full border rounded-lg p-2"
                    value={filters.duration}
                    onChange={(e) => setFilters(prev => ({
                        ...prev,
                        duration: e.target.value
                    }))}
                >
                    <option>Any Duration</option>
                    <option>Short Term</option>
                    <option>Medium Term</option>
                    <option>Long Term</option>
                </select>

                {/* Rating filter */}
                <select
                    className="w-full border rounded-lg p-2"
                    value={filters.rating}
                    onChange={(e) => setFilters(prev => ({
                        ...prev,
                        rating: e.target.value
                    }))}
                >
                    <option>Any Rating</option>
                    <option>4+ Stars</option>
                    <option>3+ Stars</option>
                    <option>2+ Stars</option>
                </select>
            </div>

            {/* Resource list */}
            <div className="resource-list mt-6 space-y-4">
                {resources.map((resource: any) => (
                    <div 
                        key={resource.id} 
                        className="resource-item p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-lg font-semibold">{resource.title}</h3>
                        <p className="text-gray-600 mt-2">{resource.description}</p>
                        <a 
                            href={resource.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                        >
                            View Resource
                        </a>
                    </div>
                ))}
                {resources.length === 0 && (
                    <div className="text-center text-gray-500">
                        No resources found
                    </div>
                )}
            </div>
        </div>
    );
};