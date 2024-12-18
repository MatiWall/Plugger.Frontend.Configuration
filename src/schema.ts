import { z } from 'zod';

// Define the schema
const configSchema = z.object({
    app: z.object({
        title: z.string().default('App Name'), 
        url: z.string().url().default('http://default.url') 
    }).default({
        title: 'App Name',
        url: 'http://default.url'
    }),
    environment: z.enum(['development', 'production', 'test']).default('development'),
    extensions: z.record(z.string(), z.unknown()).default({})
});

// Export the schema
export default configSchema;
