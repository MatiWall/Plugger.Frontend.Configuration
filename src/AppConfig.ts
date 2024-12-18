import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';
import { z, ZodType } from 'zod';
import configSchema from './schema';
import { idGenerator } from '@plugger/utils';


type ConfigType = z.infer<typeof configSchema>;

class AppConfig {
    config: ConfigType;
    schema: ZodType;

    constructor(config?: string | ConfigType) {
        this.schema = configSchema;

        let tmpConfig;
        if (config === undefined ){
            tmpConfig = {}
        }
        else if (typeof config === 'string') {
            tmpConfig = this.loadAndValidateConfig(config);
        } else {
            tmpConfig = config
        }

        this.config = this.schema.parse(tmpConfig);

    }

    private loadAndValidateConfig(filePath: string): object {
        const ext = path.extname(filePath || '').toLowerCase();

        // Ensure file exists
        if (!filePath || !fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        // Read the file
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Parse the file content
        const parsedConfig = this.parseFileContent(fileContent, ext);

        // Validate the parsed configuration
        return parsedConfig;
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
            throw new Error(`Failed to parse file. Error: ${error.message}`);
        }
    }

    getExtensionConfig(namespace: string, name: string, kind: string){
        const id = idGenerator(namespace, name, kind);
        return this.config.extensions[id];
    }
}

function createAppConfig({
    config
}: {
    config?: ConfigType | string;
} = {}) {
    return new AppConfig(config);
}

export { createAppConfig, AppConfig };
export type { ConfigType };
