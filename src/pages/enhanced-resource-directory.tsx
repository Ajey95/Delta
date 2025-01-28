// import React, { useState, useEffect } from 'react';
// import { Search, Filter, BookOpen, Download, Share2, Star, Clock, Tag, TrendingUp, Users, ArrowUpRight, ChevronDown } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';

// const ResourceDirectory = () => {
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [resources, setResources] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [stats, setStats] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({
//     type: 'All Types',
//     duration: 'Any Duration',
//     rating: 'Any Rating'
//   });

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch('/api/categories');
//         if (!response.ok) throw new Error('Failed to fetch categories');
//         const data = await response.json();
//         setCategories(['All', ...data]);
//       } catch (err) {
//         setError(err.message);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch stats
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await fetch('/api/stats');
//         if (!response.ok) throw new Error('Failed to fetch stats');
//         const data = await response.json();
//         setStats(data);
//       } catch (err) {
//         setError(err.message);
//       }
//     };
//     fetchStats();
//   }, []);

//   // Fetch resources with filters
//   useEffect(() => {
//     const fetchResources = async () => {
//       setIsLoading(true);
//       try {
//         const queryParams = new URLSearchParams({
//           category: selectedCategory !== 'All' ? selectedCategory : '',
//           search: searchQuery,
//           type: filters.type !== 'All Types' ? filters.type : '',
//           duration: filters.duration !== 'Any Duration' ? filters.duration : '',
//           rating: filters.rating !== 'Any Rating' ? filters.rating : ''
//         });

//         const response = await fetch(`/api/resources?${queryParams}`);
//         if (!response.ok) throw new Error('Failed to fetch resources');
//         const data = await response.json();
//         setResources(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     // Add debounce for search query
//     const timeoutId = setTimeout(fetchResources, 300);
//     return () => clearTimeout(timeoutId);
//   }, [selectedCategory, searchQuery, filters]);

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const renderResourceCard = (resource) => (
//     <Card className="hover:shadow-lg transition-all">
//       <CardContent className="p-6">
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <span className="text-sm text-purple-600 font-medium">
//                 {resource.category}
//               </span>
//               <Badge variant="secondary" className="bg-purple-100">
//                 {resource.type}
//               </Badge>
//             </div>
//             <h3 className="text-xl font-semibold mb-1">{resource.title}</h3>
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <div className="flex items-center">
//                 <Star className="h-4 w-4 text-yellow-400 mr-1" />
//                 {resource.rating}
//               </div>
//               <span>•</span>
//               <span>{resource.reviews} reviews</span>
//             </div>
//           </div>
//           <Badge variant="outline" className="bg-purple-50">
//             <TrendingUp className="h-4 w-4 mr-1" />
//             {resource.popularity}% match
//           </Badge>
//         </div>
        
//         <p className="text-gray-600 mb-4">{resource.description}</p>
        
//         <div className="flex flex-wrap gap-2 mb-4">
//           {resource.tags.map((tag) => (
//             <Badge key={tag} variant="secondary" className="bg-gray-100">
//               {tag}
//             </Badge>
//           ))}
//         </div>

//         {resource.deadline && (
//           <div className="flex items-center text-sm text-gray-600 mb-4">
//             <Clock className="h-4 w-4 mr-2" />
//             Application Deadline: {new Date(resource.deadline).toLocaleDateString()}
//           </div>
//         )}

//         {resource.duration && (
//           <div className="flex items-center text-sm text-gray-600 mb-4">
//             <Clock className="h-4 w-4 mr-2" />
//             Duration: {resource.duration}
//           </div>
//         )}

//         {resource.members && (
//           <div className="flex items-center text-sm text-gray-600 mb-4">
//             <Users className="h-4 w-4 mr-2" />
//             {resource.members.toLocaleString()} active members
//           </div>
//         )}

//         <div className="flex gap-2">
//           <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
//             <BookOpen className="h-4 w-4 mr-2" /> View Details
//           </Button>
//           <Button variant="outline" size="icon">
//             <Download className="h-4 w-4" />
//           </Button>
//           <Button variant="outline" size="icon">
//             <Share2 className="h-4 w-4" />
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   if (error) {
//     return (
//       <div className="max-w-7xl mx-auto p-6">
//         <Card className="p-6 text-center text-red-600">
//           <h2 className="text-xl font-semibold mb-2">Error</h2>
//           <p>{error}</p>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Search Header */}
//       <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
//         <div className="max-w-2xl mb-8">
//           <h1 className="text-4xl font-bold mb-4">Resource Directory</h1>
//           <p className="text-white/90">
//             Discover curated resources, funding opportunities, and learning materials designed to support women entrepreneurs.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-4 mb-8">
//           {Object.entries(stats).map(([key, value]) => (
//             <div key={key} className="bg-white/10 rounded-lg p-4">
//               <div className="text-2xl font-bold">{value}</div>
//               <div className="text-white/80">{key}</div>
//             </div>
//           ))}
//         </div>

//         <div className="flex gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search resources..."
//               className="w-full pl-10 p-3 rounded-lg bg-white text-gray-900"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <Button 
//             variant="outline" 
//             className="bg-white/10 text-white border-white/20"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             <Filter className="h-5 w-5 mr-2" /> Filter
//           </Button>
//         </div>
//       </div>

//       {/* Filter Panel */}
//       {showFilters && (
//         <Card className="mb-8">
//           <CardContent className="p-6">
//             <div className="grid md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Resource Type</label>
//                 <select 
//                   className="w-full p-2 border rounded-lg"
//                   value={filters.type}
//                   onChange={(e) => handleFilterChange('type', e.target.value)}
//                 >
//                   <option>All Types</option>
//                   <option>Courses</option>
//                   <option>Grants</option>
//                   <option>Networks</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Duration</label>
//                 <select 
//                   className="w-full p-2 border rounded-lg"
//                   value={filters.duration}
//                   onChange={(e) => handleFilterChange('duration', e.target.value)}
//                 >
//                   <option>Any Duration</option>
//                   <option>Under 4 weeks</option>
//                   <option>1-3 months</option>
//                   <option>3+ months</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Rating</label>
//                 <select 
//                   className="w-full p-2 border rounded-lg"
//                   value={filters.rating}
//                   onChange={(e) => handleFilterChange('rating', e.target.value)}
//                 >
//                   <option>Any Rating</option>
//                   <option>4.5+</option>
//                   <option>4.0+</option>
//                   <option>3.5+</option>
//                 </select>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Categories */}
//       <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
//         {categories.map((cat) => (
//           <Button
//             key={cat}
//             variant={selectedCategory === cat ? "default" : "outline"}
//             className={`rounded-full ${
//               selectedCategory === cat ? "bg-purple-600" : "hover:bg-purple-50"
//             }`}
//             onClick={() => setSelectedCategory(cat)}
//           >
//             {cat}
//           </Button>
//         ))}
//       </div>

//       {/* Resources Grid */}
//       {isLoading ? (
//         <div className="grid md:grid-cols-2 gap-6">
//           {[1, 2, 3, 4].map((n) => (
//             <Card key={n} className="p-6">
//               <div className="animate-pulse">
//                 <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
//                 <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
//                 <div className="h-20 bg-gray-200 rounded mb-4"></div>
//                 <div className="flex gap-2 mb-4">
//                   {[1, 2, 3].map((i) => (
//                     <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
//                   ))}
//                 </div>
//                 <div className="flex gap-2">
//                   <div className="h-10 bg-gray-200 rounded flex-1"></div>
//                   <div className="h-10 bg-gray-200 rounded w-10"></div>
//                   <div className="h-10 bg-gray-200 rounded w-10"></div>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-2 gap-6">
//           {resources.map((resource, idx) => (
//             <div key={idx}>{renderResourceCard(resource)}</div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResourceDirectory;