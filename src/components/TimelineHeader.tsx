import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Download, 
  Upload, 
  Settings, 
  Layout,
  Calendar,
  Clock,
  Users,
  Globe
} from 'lucide-react';
import { useTimelineStore } from '@/store/timelineStore';
import { cn } from '@/lib/utils';

interface TimelineHeaderProps {
  onAddEvent: () => void;
  onLayoutChange: (layout: 'horizontal' | 'vertical') => void;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ onAddEvent, onLayoutChange }) => {
  const { activeTimeline, updateTimeline } = useTimelineStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(activeTimeline?.title || '');

  if (!activeTimeline) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-muted-foreground">No Timeline Selected</h1>
        <p className="text-muted-foreground mt-2">Create a new timeline to get started</p>
      </div>
    );
  }

  const handleTitleSave = () => {
    if (title.trim() && title !== activeTimeline.title) {
      updateTimeline(activeTimeline.id, { title: title.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    }
    if (e.key === 'Escape') {
      setTitle(activeTimeline.title);
      setIsEditing(false);
    }
  };

  const getEraStats = () => {
    const stats = activeTimeline.events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([era, count]) => ({ era, count }));
  };

  const eraStats = getEraStats();
  const totalEvents = activeTimeline.events.length;
  const timeSpan = totalEvents > 0 ? {
    earliest: Math.min(...activeTimeline.events.map(e => e.year)),
    latest: Math.max(...activeTimeline.events.map(e => e.year))
  } : null;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="timeline-hero overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleKeyPress}
                  className="text-2xl font-bold bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  autoFocus
                />
              ) : (
                <h1 
                  className="text-3xl font-bold mb-2 cursor-pointer hover:text-white/90 transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  {activeTimeline.title}
                </h1>
              )}
              
              <p className="text-white/90 text-lg max-w-2xl">
                {activeTimeline.description}
              </p>
              
              {timeSpan && (
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Clock className="h-3 w-3 mr-1" />
                    {timeSpan.earliest} - {timeSpan.latest}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Calendar className="h-3 w-3 mr-1" />
                    {totalEvents} Events
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Select onValueChange={onLayoutChange} defaultValue={activeTimeline.layout}>
                <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                  <Layout className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={onAddEvent}
                className="bg-white/20 hover:bg-white/30 border border-white/30 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      {totalEvents > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-timeline-primary" />
              <div className="text-2xl font-bold">{totalEvents}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-timeline-secondary" />
              <div className="text-2xl font-bold">
                {timeSpan ? timeSpan.latest - timeSpan.earliest : 0}
              </div>
              <div className="text-sm text-muted-foreground">Years Covered</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Globe className="h-8 w-8 mx-auto mb-2 text-timeline-accent" />
              <div className="text-2xl font-bold">{eraStats.length}</div>
              <div className="text-sm text-muted-foreground">Historical Eras</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-timeline-primary" />
              <div className="text-2xl font-bold">
                {activeTimeline.events.filter(e => e.importance === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">Major Events</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Era Distribution */}
      {eraStats.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Era Distribution
            </h3>
            <div className="space-y-3">
              {eraStats.map(({ era, count }) => {
                const percentage = (count / totalEvents) * 100;
                const colors = {
                  ancient: 'bg-timeline-ancient',
                  classical: 'bg-timeline-classical',
                  medieval: 'bg-timeline-medieval',
                  renaissance: 'bg-timeline-renaissance',
                  modern: 'bg-timeline-modern',
                  contemporary: 'bg-timeline-contemporary'
                };
                
                return (
                  <div key={era} className="flex items-center gap-3">
                    <div className="w-16 text-sm font-medium capitalize">{era}</div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className={cn('h-2 rounded-full transition-all duration-300', colors[era as keyof typeof colors])}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-muted-foreground text-right">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimelineHeader;