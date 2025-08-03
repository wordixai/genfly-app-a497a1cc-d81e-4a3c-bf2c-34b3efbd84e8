import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, Calendar } from 'lucide-react';
import { useTimelineStore, TimelineEvent } from '@/store/timelineStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  date: z.string().min(1, 'Date is required'),
  year: z.number().min(-5000, 'Year must be after 5000 BCE').max(2100, 'Year must be before 2100 CE'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  category: z.enum(['ancient', 'classical', 'medieval', 'renaissance', 'modern', 'contemporary']),
  importance: z.enum(['low', 'medium', 'high'])
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: TimelineEvent;
  isOpen: boolean;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, isOpen, onClose }) => {
  const { activeTimeline, addEvent, updateEvent } = useTimelineStore();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      date: event?.date || '',
      year: event?.year || new Date().getFullYear(),
      imageUrl: event?.imageUrl || '',
      category: event?.category || 'modern',
      importance: event?.importance || 'medium'
    }
  });

  const onSubmit = (data: EventFormData) => {
    if (!activeTimeline) return;

    if (event) {
      updateEvent(event.id, data);
    } else {
      addEvent(activeTimeline.id, data);
    }

    form.reset();
    onClose();
  };

  const categories = [
    { value: 'ancient', label: 'Ancient (Before 500 CE)', color: 'bg-timeline-ancient' },
    { value: 'classical', label: 'Classical (500-1000 CE)', color: 'bg-timeline-classical' },
    { value: 'medieval', label: 'Medieval (1000-1500 CE)', color: 'bg-timeline-medieval' },
    { value: 'renaissance', label: 'Renaissance (1500-1700 CE)', color: 'bg-timeline-renaissance' },
    { value: 'modern', label: 'Modern (1700-1950 CE)', color: 'bg-timeline-modern' },
    { value: 'contemporary', label: 'Contemporary (1950-Present)', color: 'bg-timeline-contemporary' }
  ];

  const suggstedImages = [
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1569019604570-a31d5bb5d3dd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=400&h=300&fit=crop',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {event ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the title of the historical event" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what happened and its significance..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Year */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1066 AD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year (for sorting)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1066"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Era</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an era" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Importance */}
            <FormField
              control={form.control}
              name="importance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Importance</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select importance level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low Impact</SelectItem>
                      <SelectItem value="medium">Medium Impact</SelectItem>
                      <SelectItem value="high">High Impact</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  
                  {/* Image preview */}
                  {field.value && (
                    <div className="mt-2">
                      <img 
                        src={field.value} 
                        alt="Preview"
                        className="h-24 w-32 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Suggested images */}
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Or choose from suggestions:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {suggstedImages.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Suggestion ${index + 1}`}
                          className="h-16 w-20 object-cover rounded cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          onClick={() => form.setValue('imageUrl', url)}
                        />
                      ))}
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="timeline-hero">
                <Plus className="h-4 w-4 mr-2" />
                {event ? 'Update Event' : 'Add Event'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;