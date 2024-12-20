import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  category: z.string({
    required_error: 'Please select a metric category.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  value: z.string().min(1, {
    message: 'Please enter a value.',
  }),
  unit: z.string().min(1, {
    message: 'Please specify the unit.',
  }),
  date: z.string().min(1, {
    message: 'Please enter a date.',
  }),
  notes: z.string(),
})

export function MetricsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      value: '',
      unit: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // TODO: Submit to API
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metric Name</FormLabel>
              <FormControl>
                <Input placeholder="Metric name" {...field} />
              </FormControl>
              <FormDescription>
                The name of the metric you're tracking.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="community">Community Growth</SelectItem>
                  <SelectItem value="engagement">Developer Engagement</SelectItem>
                  <SelectItem value="content">Content Performance</SelectItem>
                  <SelectItem value="adoption">Product Adoption</SelectItem>
                  <SelectItem value="support">Developer Support</SelectItem>
                  <SelectItem value="events">Events & Programs</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The category this metric belongs to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this metric measures..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A clear description of what this metric measures.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>
                  The numeric value of the metric.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="users, views, etc." {...field} />
                </FormControl>
                <FormDescription>
                  The unit of measurement.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                When this metric was recorded.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional notes about this metric.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Metric</Button>
      </form>
    </Form>
  )
}
