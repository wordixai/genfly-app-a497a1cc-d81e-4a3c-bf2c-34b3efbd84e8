import React, { useState } from 'react';
import Timeline from '@/components/Timeline';
import TimelineHeader from '@/components/TimelineHeader';
import EventForm from '@/components/EventForm';
import EventDetail from '@/components/EventDetail';
import { useTimelineStore, TimelineEvent } from '@/store/timelineStore';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const { activeTimeline, updateTimeline, selectedEvent, setSelectedEvent } = useTimelineStore();
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  React.useEffect(() => {
    if (selectedEvent) {
      setIsEventDetailOpen(true);
    }
  }, [selectedEvent]);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsEventFormOpen(true);
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event);
    setIsEventDetailOpen(false);
    setIsEventFormOpen(true);
  };

  const handleLayoutChange = (layout: 'horizontal' | 'vertical') => {
    if (activeTimeline) {
      updateTimeline(activeTimeline.id, { layout });
    }
  };

  const handleEventDetailClose = () => {
    setIsEventDetailOpen(false);
    setSelectedEvent(null);
  };

  if (!activeTimeline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-timeline-primary/10 to-timeline-secondary/10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Timeline Builder</h1>
          <p className="text-xl text-muted-foreground">Create beautiful historical timelines</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-timeline-muted to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <TimelineHeader 
          onAddEvent={handleAddEvent}
          onLayoutChange={handleLayoutChange}
        />
        
        <Timeline 
          layout={activeTimeline.layout}
          className="mt-8"
        />
      </div>

      {/* Event Form Dialog */}
      <EventForm
        event={editingEvent}
        isOpen={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setEditingEvent(null);
        }}
      />

      {/* Event Detail Dialog */}
      <EventDetail
        event={selectedEvent}
        isOpen={isEventDetailOpen}
        onClose={handleEventDetailClose}
        onEdit={handleEditEvent}
      />

      <Toaster />
    </div>
  );
};

export default Index;