import { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
      maxlength: [500, 'Overview cannot exceed 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one agenda item is required',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to normalize date to ISO format
function normalizeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  } catch (error) {
    // Try to parse common date formats
    const formats = [
      'YYYY-MM-DD',
      'MM/DD/YYYY', 
      'DD/MM/YYYY',
      'MMMM DD, YYYY'
    ];
    
    // If we can't parse it, just return the original string
    // or you could throw an error here
    console.warn(`Could not normalize date: ${dateString}`);
    return dateString;
  }
}

// Helper function to normalize time format
function normalizeTime(timeString: string): string {
  try {
    // Handle various time formats and convert to HH:MM (24-hour format)
    const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
    const match = timeString.trim().match(timeRegex);
    
    if (!match) {
      // Try to parse 24-hour format without AM/PM
      const simpleMatch = timeString.trim().match(/^(\d{1,2}):(\d{2})$/);
      if (simpleMatch) {
        let hours = parseInt(simpleMatch[1]);
        const minutes = simpleMatch[2];
        
        if (hours >= 0 && hours <= 23 && parseInt(minutes) >= 0 && parseInt(minutes) <= 59) {
          return `${hours.toString().padStart(2, '0')}:${minutes}`;
        }
      }
      throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
    }
    
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[4]?.toUpperCase();
    
    if (period) {
      // Convert 12-hour to 24-hour format
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
    }
    
    if (hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
      throw new Error('Invalid time values');
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  } catch (error) {
    console.warn(`Could not normalize time: ${timeString}`);
    return timeString;
  }
}

// For Mongoose 9.x - Updated middleware syntax
EventSchema.pre('save', async function () {
  const event = this as IEvent;

  // Generate slug only if title changed or document is new
  if (event.isModified('title') || event.isNew) {
    event.slug = generateSlug(event.title);
  }

  // Normalize date format
  if (event.isModified('date')) {
    try {
      event.date = normalizeDate(event.date);
    } catch (error: any) {
      // In Mongoose 9, throw errors to abort save
      throw new Error(`Date validation failed: ${error.message}`);
    }
  }

  // Normalize time format
  if (event.isModified('time')) {
    try {
      event.time = normalizeTime(event.time);
    } catch (error: any) {
      throw new Error(`Time validation failed: ${error.message}`);
    }
  }
  
  // Additional validation: ensure date is in the future (optional)
//   if (event.isModified('date') || event.isNew) {
//     const eventDate = new Date(event.date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     if (eventDate < today) {
//       throw new Error('Event date must be in the future');
//     }
//   }
});

// Alternative: Using Mongoose 9's document middleware option
// EventSchema.pre('save', { document: true }, async function () {
//   // Same logic as above
// });

// Create unique index on slug for better performance
EventSchema.index({ slug: 1 }, { unique: true });

// Create compound index for common queries
EventSchema.index({ date: 1, mode: 1 });

// Text index for search functionality
EventSchema.index(
  { 
    title: 'text', 
    description: 'text', 
    overview: 'text',
    tags: 'text'
  },
  {
    weights: {
      title: 10,
      tags: 5,
      description: 3,
      overview: 1
    },
    name: 'event_search_index'
  }
);

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;