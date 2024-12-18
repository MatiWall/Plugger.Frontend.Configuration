import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';
import {z, ZodType} from 'zod'
import configSchema from './schema';

type ConfigType = z.infer<typeof configSchema>;

class AppConfig {
    filePath: string;

    config: ConfigType

    schema: ZodType;

    constructor(
        filePath: string
        ){
        this.filePath = filePath;
        
        this.schema = configSchema;

        this.config = this.loadConfig();

    }

    private loadConfig(): ConfigType {
        const ext = path.extname(this.filePath).toLowerCase();

        // Check if the file exists
        if (!fs.existsSync(this.filePath)) {
            throw new Error(`File not found: ${this.filePath}`);
        }

        // Read the file
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');

        let config = {};
        // Parse based on file extension
        if (ext === '.json') {
            config = JSON.parse(fileContent);
        } else if (ext === '.yaml' || ext === '.yml') {
            config = parseYaml(fileContent);
        } else {
            throw new Error(`Unsupported file format: ${ext}`);
        }
        
        return this.schema.parse(config);
    }
}


function createAppConfig({
    filePath
}: {
    filePath: string
}){
    return new AppConfig(filePath);
}


export {
    createAppConfig, 
    AppConfig
}