import { AppConfig, createAppConfig } from './AppConfig';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import { parse as parseYaml } from 'yaml';

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');
jest.mock('yaml', () => ({
  parse: jest.fn()
}));

describe('AppConfig', () => {
    afterEach(() => {
        jest.clearAllMocks();  // Reset mocks after each test
    });

    it('should load JSON config correctly', () => {
        const mockFilePath = 'config.json';
        const mockJsonData = { name: 'TestApp', version: '1.0.0' };
        fs.existsSync.mockReturnValue(true);  // Simulate file exists
        fs.readFileSync.mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        path.extname.mockReturnValue('.json');  // Simulate the file extension
        
        const appConfig = new AppConfig(mockFilePath);

        expect(appConfig.config).toEqual(mockJsonData);
    });

    it('should load YAML config correctly', () => {
        const mockFilePath = 'config.yaml';
        const mockYamlData = { name: 'TestApp', version: '1.0.0' };
        fs.existsSync.mockReturnValue(true);  // Simulate file exists
        fs.readFileSync.mockReturnValue('name: TestApp\nversion: 1.0.0\n');  // Simulate YAML content
        path.extname.mockReturnValue('.yaml');  // Simulate the file extension
        parseYaml.mockReturnValue(mockYamlData);  // Mock YAML parser
        
        const appConfig = new AppConfig(mockFilePath);

        expect(appConfig.config).toEqual(mockYamlData);
    });

    it('should throw an error if file does not exist', () => {
        const mockFilePath = 'nonexistent.json';
        fs.existsSync.mockReturnValue(false);  // Simulate file not existing
        
        expect(() => {
            new AppConfig(mockFilePath);
        }).toThrowError(`File not found: ${mockFilePath}`);
    });

    it('should throw an error if the file extension is unsupported', () => {
        const mockFilePath = 'config.txt';
        fs.existsSync.mockReturnValue(true);  // Simulate file exists
        fs.readFileSync.mockReturnValue('unsupported content');  // Mock file content
        path.extname.mockReturnValue('.txt');  // Simulate an unsupported file extension
        
        expect(() => {
            new AppConfig(mockFilePath);
        }).toThrowError('Unsupported file format: .txt');
    });

    it('should apply the provided schema for validation', () => {
        const mockFilePath = 'config.json';
        const mockJsonData = { name: 'TestApp' };
        fs.existsSync.mockReturnValue(true);  // Simulate file exists
        fs.readFileSync.mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        path.extname.mockReturnValue('.json');  // Simulate the file extension

        // Create a schema that requires a "name" field
        const schema = z.object({
            name: z.string().min(3),
        });

        const appConfig = new AppConfig(mockFilePath, schema);
        
        expect(appConfig.config).toEqual(mockJsonData);
    });

    it('should throw an error if the config does not match the schema', () => {
        const mockFilePath = 'config.json';
        const mockJsonData = { name: 'A' };  // This will fail the schema validation
        fs.existsSync.mockReturnValue(true);  // Simulate file exists
        fs.readFileSync.mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        path.extname.mockReturnValue('.json');  // Simulate the file extension

        const schema = z.object({
            name: z.string().min(3),  // Name should be at least 3 characters
        });

        expect(() => {
            new AppConfig(mockFilePath, schema);
        }).toThrowError('Invalid input');
    });

    it('should create AppConfig using createAppConfig function', () => {
        const mockFilePath = 'config.json';
        const mockJsonData = { name: 'TestApp', version: '1.0.0' };
        fs.existsSync.mockReturnValue(true);  // Simulate file exists
        fs.readFileSync.mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        path.extname.mockReturnValue('.json');  // Simulate the file extension
        
        const appConfig = createAppConfig({
            filePath: mockFilePath,
            schema: z.object({ name: z.string() })
        });

        expect(appConfig.config).toEqual(mockJsonData);
    });
});
