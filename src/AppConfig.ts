import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';
import { z, ZodType } from 'zod';
import configSchema from './schema';

type ConfigType = z.infer<typeof configSchema>;

class AppConfig {
    filePath?: string;
    config: ConfigType;
    schema: ZodType;

    constructor(filePath?: string, config?: ConfigType) {
        this.schema = configSchema;

        if (filePath !== undefined) {
            this.filePath = filePath;
            this.config = this.loadAndValidateConfig();
        } else if (config !== undefined) {
            this.config = this.schema.parse(config);
        } else {
            throw new Error('Both filePath and config cannot be undefined.');
        }
    }

    private loadAndValidateConfig(): ConfigType {
        const ext = path.extname(this.filePath || '').toLowerCase();

        // Ensure file exists
        if (!this.filePath || !fs.existsSync(this.filePath)) {
            throw new Error(`File not found: ${this.filePath}`);
        }

        // Read the file
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');

        // Parse the file content
        const parsedConfig = this.parseFileContent(fileContent, ext);

        // Validate the parsed configuration
        return this.schema.parse(parsedConfig);
    }

    private parseFileContent(fileContent: string, ext: string): object {
        try {
            if (ext === '.json') {
                return JSON.parse(fileContent);
            } else if (ext === '.yaml' || ext === '.yml') {
                return parseYaml(fileContent);
            } else {
                throw new Error(`Unsupported file format: ${ext}`);
            }
        } catch (error) {
            throw new Error(`Failed to parse file: ${this.filePath}. Error: ${error.message}`);
        }
    }
}

function createAppConfig({
    filePath,
    config,
}: {
    filePath?: string;
    config?: ConfigType;
}) {
    return new AppConfig(filePath, config);
}

export { createAppConfig, AppConfig };
export type { ConfigType };
