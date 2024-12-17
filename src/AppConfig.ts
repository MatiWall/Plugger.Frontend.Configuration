import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';
import {z, ZodType} from 'zod'


class AppConfig {
    filePath: string;

    config: object = {}

    schema: ZodType

    constructor(
        filePath: string,
        schema?: ZodType
        ){
        this.filePath = filePath;
        
        this.schema = schema || z.object({})

        this.config = this.loadConfig();

    }

    private loadConfig(): any {
        const ext = path.extname(this.filePath).toLowerCase();

        // Check if the file exists
        if (!fs.existsSync(this.filePath)) {
            throw new Error(`File not found: ${this.filePath}`);
        }

        // Read the file
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');

        // Parse based on file extension
        if (ext === '.json') {
            return JSON.parse(fileContent);
        } else if (ext === '.yaml' || ext === '.yml') {
            return parseYaml(fileContent);
        } else {
            throw new Error(`Unsupported file format: ${ext}`);
        }
    }
}


function createAppConfig({
    filePath,
    schema = z.object({})
}: {
    filePath: string, 
    schema: ZodType
}){
    return new AppConfig(filePath, schema);
}


export {
    createAppConfig, 
    AppConfig
}