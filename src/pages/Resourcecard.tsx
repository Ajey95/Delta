import React from 'react';
import { Share2, BookOpen, Star, Clock, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Resource } from '../types';

interface ResourceCardProps {
  resource: Resource;
  onShare?: (resource: Resource) => void;
  onView?: (resource: Resource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onShare,
  onView
}) => {
  return (
    <Card className="mb-4">
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
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onShare?.(resource)}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onView?.(resource)}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>
        <ResourceMetrics resource={resource} />
      </CardContent>
    </Card>
  );
};

// Separate the metrics section into its own component
const ResourceMetrics: React.FC<{ resource: Resource }> = ({ resource }) => {
  const metrics = [
    resource.rating && {
      icon: <Star className="h-4 w-4 mr-1" />,
      value: `${resource.rating}/5`
    },
    resource.duration && {
      icon: <Clock className="h-4 w-4 mr-1" />,
      value: resource.duration
    },
    resource.members && {
      icon: <Users className="h-4 w-4 mr-1" />,
      value: `${resource.members} members`
    }
  ].filter(Boolean);

  return (
    <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
      {metrics.map((metric, index) => (
        metric && (
          <div key={index} className="flex items-center">
            {metric.icon}
            {metric.value}
          </div>
        )
      ))}
    </div>
  );
};

export default ResourceCard;