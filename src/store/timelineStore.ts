import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  year: number;
  imageUrl?: string;
  category: 'ancient' | 'classical' | 'medieval' | 'renaissance' | 'modern' | 'contemporary';
  importance: 'low' | 'medium' | 'high';
  position: number;
}

export interface Timeline {
  id: string;
  title: string;
  description: string;
  events: TimelineEvent[];
  layout: 'horizontal' | 'vertical';
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TimelineStore {
  timelines: Timeline[];
  activeTimeline: Timeline | null;
  selectedEvent: TimelineEvent | null;
  
  // Actions
  createTimeline: (title: string, description: string) => string;
  updateTimeline: (id: string, updates: Partial<Timeline>) => void;
  deleteTimeline: (id: string) => void;
  setActiveTimeline: (timeline: Timeline | null) => void;
  
  addEvent: (timelineId: string, event: Omit<TimelineEvent, 'id' | 'position'>) => void;
  updateEvent: (eventId: string, updates: Partial<TimelineEvent>) => void;
  deleteEvent: (eventId: string) => void;
  setSelectedEvent: (event: TimelineEvent | null) => void;
  reorderEvents: (timelineId: string, eventIds: string[]) => void;
}

// Sample data
const sampleEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'Fall of the Roman Empire',
    description: 'The Western Roman Empire officially ended when Germanic chieftain Odoacer deposed Emperor Romulus Augustulus.',
    date: '476 AD',
    year: 476,
    category: 'classical',
    importance: 'high',
    position: 0,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Battle of Hastings',
    description: 'William the Conqueror defeated King Harold II, beginning Norman rule in England.',
    date: '1066 AD',
    year: 1066,
    category: 'medieval',
    importance: 'high',
    position: 1,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Printing Press Invented',
    description: 'Johannes Gutenberg invented the movable type printing press, revolutionizing the spread of knowledge.',
    date: '1440 AD',
    year: 1440,
    category: 'renaissance',
    importance: 'high',
    position: 2,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    title: 'American Revolution Begins',
    description: 'The American colonies declared independence from British rule, leading to the formation of the United States.',
    date: '1776 AD',
    year: 1776,
    category: 'modern',
    importance: 'high',
    position: 3,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    title: 'World Wide Web Created',
    description: 'Tim Berners-Lee created the World Wide Web, transforming global communication and information sharing.',
    date: '1989 AD',
    year: 1989,
    category: 'contemporary',
    importance: 'high',
    position: 4,
    imageUrl: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=400&h=300&fit=crop'
  }
];

const sampleTimeline: Timeline = {
  id: 'sample-1',
  title: 'Major Historical Events',
  description: 'A curated timeline of pivotal moments that shaped human civilization',
  events: sampleEvents,
  layout: 'horizontal',
  theme: 'default',
  createdAt: new Date(),
  updatedAt: new Date()
};

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  timelines: [sampleTimeline],
  activeTimeline: sampleTimeline,
  selectedEvent: null,

  createTimeline: (title: string, description: string) => {
    const newTimeline: Timeline = {
      id: uuidv4(),
      title,
      description,
      events: [],
      layout: 'horizontal',
      theme: 'default',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    set((state) => ({
      timelines: [...state.timelines, newTimeline],
      activeTimeline: newTimeline
    }));

    return newTimeline.id;
  },

  updateTimeline: (id: string, updates: Partial<Timeline>) => {
    set((state) => ({
      timelines: state.timelines.map((timeline) =>
        timeline.id === id
          ? { ...timeline, ...updates, updatedAt: new Date() }
          : timeline
      ),
      activeTimeline:
        state.activeTimeline?.id === id
          ? { ...state.activeTimeline, ...updates, updatedAt: new Date() }
          : state.activeTimeline
    }));
  },

  deleteTimeline: (id: string) => {
    set((state) => ({
      timelines: state.timelines.filter((timeline) => timeline.id !== id),
      activeTimeline:
        state.activeTimeline?.id === id ? null : state.activeTimeline
    }));
  },

  setActiveTimeline: (timeline: Timeline | null) => {
    set({ activeTimeline: timeline });
  },

  addEvent: (timelineId: string, eventData: Omit<TimelineEvent, 'id' | 'position'>) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: uuidv4(),
      position: 0
    };

    set((state) => {
      const updatedTimelines = state.timelines.map((timeline) => {
        if (timeline.id === timelineId) {
          const sortedEvents = [...timeline.events, newEvent].sort((a, b) => a.year - b.year);
          const eventsWithPosition = sortedEvents.map((event, index) => ({
            ...event,
            position: index
          }));

          return {
            ...timeline,
            events: eventsWithPosition,
            updatedAt: new Date()
          };
        }
        return timeline;
      });

      const updatedActiveTimeline = state.activeTimeline?.id === timelineId
        ? updatedTimelines.find(t => t.id === timelineId) || state.activeTimeline
        : state.activeTimeline;

      return {
        timelines: updatedTimelines,
        activeTimeline: updatedActiveTimeline
      };
    });
  },

  updateEvent: (eventId: string, updates: Partial<TimelineEvent>) => {
    set((state) => {
      const updatedTimelines = state.timelines.map((timeline) => ({
        ...timeline,
        events: timeline.events.map((event) =>
          event.id === eventId ? { ...event, ...updates } : event
        ),
        updatedAt: new Date()
      }));

      const updatedActiveTimeline = state.activeTimeline
        ? {
            ...state.activeTimeline,
            events: state.activeTimeline.events.map((event) =>
              event.id === eventId ? { ...event, ...updates } : event
            ),
            updatedAt: new Date()
          }
        : null;

      return {
        timelines: updatedTimelines,
        activeTimeline: updatedActiveTimeline,
        selectedEvent:
          state.selectedEvent?.id === eventId
            ? { ...state.selectedEvent, ...updates }
            : state.selectedEvent
      };
    });
  },

  deleteEvent: (eventId: string) => {
    set((state) => {
      const updatedTimelines = state.timelines.map((timeline) => ({
        ...timeline,
        events: timeline.events.filter((event) => event.id !== eventId),
        updatedAt: new Date()
      }));

      const updatedActiveTimeline = state.activeTimeline
        ? {
            ...state.activeTimeline,
            events: state.activeTimeline.events.filter((event) => event.id !== eventId),
            updatedAt: new Date()
          }
        : null;

      return {
        timelines: updatedTimelines,
        activeTimeline: updatedActiveTimeline,
        selectedEvent:
          state.selectedEvent?.id === eventId ? null : state.selectedEvent
      };
    });
  },

  setSelectedEvent: (event: TimelineEvent | null) => {
    set({ selectedEvent: event });
  },

  reorderEvents: (timelineId: string, eventIds: string[]) => {
    set((state) => {
      const updatedTimelines = state.timelines.map((timeline) => {
        if (timeline.id === timelineId) {
          const reorderedEvents = eventIds
            .map((id, index) => {
              const event = timeline.events.find((e) => e.id === id);
              return event ? { ...event, position: index } : null;
            })
            .filter(Boolean) as TimelineEvent[];

          return { ...timeline, events: reorderedEvents, updatedAt: new Date() };
        }
        return timeline;
      });

      const updatedActiveTimeline = state.activeTimeline?.id === timelineId
        ? updatedTimelines.find(t => t.id === timelineId) || state.activeTimeline
        : state.activeTimeline;

      return {
        timelines: updatedTimelines,
        activeTimeline: updatedActiveTimeline
      };
    });
  }
}));
