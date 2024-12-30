import React, { useState, ChangeEvent } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  Share2,
  Star,
  Clock,
  Users,
  PlusCircle,
  Layout
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useCategories } from './useCategories';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useCombinedResources } from './useResources';
import { useStats } from './useStats';
import { useFilters } from './useFilters';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Resource, Stats } from './types';
import { FilterOptions } from './types';
import { AddResourceForm } from './addResources';



const fetchCourses = async (topic: string) => {
  try {
    const response = await fetch(`/fetch-courses/${encodeURIComponent(topic)}`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};
const addResource = async (resourceData: any) => {
  try {
    const response = await fetch('/add-resource', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resourceData),
    });
    if (!response.ok) throw new Error('Failed to add resource');
    return await response.json();
  } catch (error) {
    console.error('Error adding resource:', error);
    throw error;
  }
};
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

// interface AddResourceFormProps {
//   onResourceAdded?: () => void;
// }

// const AddResourceForm: React.FC<AddResourceFormProps> = ({ onResourceAdded }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     link: '',
//     category: '',
//     description: '',
//     user_id: '1' // Replace with actual user ID from auth
//   });
//   const [status, setStatus] = useState({ type: '', message: '' });

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       await addResource(formData);
//       setStatus({ type: 'success', message: 'Resource added successfully!' });
//       setFormData({ title: '', link: '', category: '', description: '', user_id: '1' });
//       if (onResourceAdded) onResourceAdded();
//     } catch (error) {
//       setStatus({ type: 'error', message: error instanceof Error ? error.message : 'An unknown error occurred' });
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <PlusCircle className="h-5 w-5" />
//           Add New Resource
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             placeholder="Resource Title"
//             value={formData.title}
//             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//             required
//           />
//           <Input
//             placeholder="Resource Link"
//             value={formData.link}
//             onChange={(e) => setFormData({ ...formData, link: e.target.value })}
//             required
//           />
//           <Input
//             placeholder="Category"
//             value={formData.category}
//             onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//             required
//           />
//           <Textarea
//             placeholder="Description"
//             value={formData.description}
//             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             required
//           />
//           <Button type="submit" className="w-full">Add Resource</Button>
//         </form>
        
//         {status.message && (
//           <Alert className={`mt-4 ${status.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
//             <AlertDescription>{status.message}</AlertDescription>
//           </Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// New CourseRecommendations component integrated into the main component
const CourseRecommendations = () => {
  const [topic, setTopic] = useState('');
  interface Course {
    name: string;
    description: string;
    link: string;
  }
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!topic) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchCourses(topic);
      setCourses(data.courses);
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Course Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {error && (
          <Alert className="mb-4 bg-red-50">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {courses.map((course, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{course.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Course
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ResourceDirectory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState('browse');
  const [courseraSearchTopic, setCourseraSearchTopic] = useState<string>('');
  const { categories, error: categoriesError } = useCategories();
  const { stats, error: statsError } = useStats();
  const { filters, showFilters, handleFilterChange, toggleFilters } = useFilters();
  const {
    // Local resources
    resources,
    isLoading,
    error: resourcesError,
    refetch,
    // Coursera resources
    courseraResources,
    isCourseraLoading,
    courseraError,
    fetchCoursera
  } = useCombinedResources(selectedCategory, searchQuery, filters);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleCourseraSearch = () => {
    fetchCoursera(courseraSearchTopic);
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Browse Resources
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Resource
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Find Courses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="space-y-4">
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

             {/* Filters */}
             {showFilters && (
              <FilterSection
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            )}

            {/* Resources list */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {resources.map((resource:Resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="add">
          <AddResourceForm onResourceAdded={refetch} />
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Find Coursera Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter topic..."
                    value={courseraSearchTopic}
                    onChange={(e) => setCourseraSearchTopic(e.target.value)}
                  />
                  <Button 
                    onClick={handleCourseraSearch}
                    disabled={isCourseraLoading}
                  >
                    {isCourseraLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {courseraError && (
                  <Alert variant="destructive">
                    <AlertDescription>{courseraError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {courseraResources.map((course, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{course.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                        <a
                          href={course.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Course
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceDirectory;