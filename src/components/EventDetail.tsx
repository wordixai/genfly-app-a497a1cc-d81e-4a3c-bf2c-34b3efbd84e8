import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, Star, Edit, Trash2, X } from 'lucide-react';
import { TimelineEvent, useTimelineStore } from '@/store/timelineStore';
import { cn } from '@/lib/utils';

interface EventDetailProps {
  event: TimelineEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: TimelineEvent) => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, isOpen, onClose, onEdit }) => {
  const { deleteEvent } = useTimelineStore();

  if (!event) return null;

  const handleDelete = () => {
    deleteEvent(event.id);
    onClose();
  };

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

  const getImportanceLevel = (importance: string) => {
    const levels = {
      low: { label: 'Minor Historical Event', stars: 1 },
      medium: { label: 'Significant Historical Event', stars: 2 },
      high: { label: 'Major Historical Event', stars: 3 }
    };
    return levels[importance as keyof typeof levels] || levels.medium;
  };

  const importance = getImportanceLevel(event.importance);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              className={cn('text-white', getCategoryColor(event.category))}
            >
              {event.date}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {event.category} Era
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {event.imageUrl && (
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm font-medium">{event.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Year:</span>
                  <span className="text-sm font-medium">{event.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Era:</span>
                  <span className="text-sm font-medium capitalize">{event.category}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Historical Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 3 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < importance.stars
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {importance.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Event
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                onClick={() => onEdit(event)}
                className="timeline-hero"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetail;