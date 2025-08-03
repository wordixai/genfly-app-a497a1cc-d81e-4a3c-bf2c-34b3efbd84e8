import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Eye, Edit3 } from 'lucide-react';
import { TimelineEvent, useTimelineStore } from '@/store/timelineStore';
import { cn } from '@/lib/utils';

interface TimelineProps {
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ layout = 'horizontal', className }) => {
  const { activeTimeline, setSelectedEvent } = useTimelineStore();

  if (!activeTimeline || !activeTimeline.events.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No events in this timeline</p>
          <p className="text-sm">Add your first historical event to get started</p>
        </div>
      </div>
    );
  }

  const sortedEvents = [...activeTimeline.events].sort((a, b) => a.year - b.year);

  const getCategoryColor = (category: string) => {
    const colors = {
      ancient: 'era-ancient',
      classical: 'era-classical',
      medieval: 'era-medieval',
      renaissance: 'era-renaissance',
      modern: 'era-modern',
      contemporary: 'era-contemporary'
    };
    return colors[category as keyof typeof colors] || 'bg-timeline-primary';
  };

  const getImportanceSize = (importance: string) => {
    return importance === 'high' ? 'w-6 h-6' : importance === 'medium' ? 'w-5 h-5' : 'w-4 h-4';
  };

  if (layout === 'vertical') {
    return (
      <div className={cn('space-y-8 p-6', className)}>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 timeline-line" />
          
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start mb-8">
              {/* Timeline dot */}
              <div 
                className={cn(
                  'timeline-dot',
                  getImportanceSize(event.importance),
                  getCategoryColor(event.category),
                  'flex-shrink-0 z-10'
                )}
              />
              
              {/* Event card */}
              <Card 
                className="ml-6 timeline-event cursor-pointer group"
                onClick={() => setSelectedEvent(event)}
              >
                {event.imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge 
                      variant="secondary"
                      className={cn('text-white', getCategoryColor(event.category))}
                    >
                      {event.date}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-3">{event.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {event.category}
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6', className)}>
      <div className="relative">
        {/* Horizontal timeline line */}
        <div className="relative h-2 timeline-gradient rounded-full mb-8">
          {/* Era markers */}
          <div className="absolute inset-0 era-gradient rounded-full" />
        </div>
        
        {/* Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedEvents.map((event, index) => (
            <Card 
              key={event.id}
              className="timeline-event cursor-pointer group animate-slide-in-timeline"
              style={{
                animationDelay: `${index * 100}ms`
              }}
              onClick={() => setSelectedEvent(event)}
            >
              {event.imageUrl && (
                <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  <Badge 
                    className={cn(
                      'absolute top-2 right-2 text-white',
                      getCategoryColor(event.category)
                    )}
                  >
                    {event.date}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-2">
                <CardTitle className="text-sm leading-tight">{event.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
                  {event.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className="text-xs capitalize"
                  >
                    {event.category}
                  </Badge>
                  
                  <div 
                    className={cn(
                      'rounded-full',
                      getCategoryColor(event.category),
                      getImportanceSize(event.importance)
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;