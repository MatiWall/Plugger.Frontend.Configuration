import {z} from 'zod';

const configSchema = z.object({
    app: z.object({
        title: z.string().default('App Name'),
        url: z.string().url('String is not a valid url')
    }),
    environment: z.enum(['development', 'production', 'test']).default('development'),
    extensions: z.record(z.object({})).default({})
})


export default configSchema