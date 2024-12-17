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

    test('should load JSON config correctly', () => {
        const mockFilePath = 'config.json';
        const mockJsonData = { name: 'TestApp', version: '1.0.0' };
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        (path.extname as jest.Mock).mockReturnValue('.json');  // Simulate the file extension
        
        const appConfig = new AppConfig(mockFilePath);

        expect(appConfig.config).toEqual(mockJsonData);
    });

    test('should load YAML config correctly', () => {
        const mockFilePath = 'config.yaml';
        const mockYamlData = { name: 'TestApp', version: '1.0.0' };
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue('name: TestApp\nversion: 1.0.0\n');  // Simulate YAML content
        (path.extname as jest.Mock).mockReturnValue('.yaml');  // Simulate the file extension
        (parseYaml as jest.Mock).mockReturnValue(mockYamlData);  // Mock YAML parser
        
        const appConfig = new AppConfig(mockFilePath);

        expect(appConfig.config).toEqual(mockYamlData);
    });

    test('should throw an error if file does not exist', () => {
        const mockFilePath = 'nonexistent.json';
        (fs.existsSync as jest.Mock).mockReturnValue(false);  // Simulate file not existing
        
        expect(() => {
            new AppConfig(mockFilePath);
        }).toThrowError(`File not found: ${mockFilePath}`);
    });

    test('should throw an error if the file extension is unsupported', () => {
        const mockFilePath = 'config.txt';
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue('unsupported content');  // Mock file content
        (path.extname as jest.Mock).mockReturnValue('.txt');  // Simulate an unsupported file extension
        
        expect(() => {
            new AppConfig(mockFilePath);
        }).toThrowError('Unsupported file format: .txt');
    });

    test('should apply the provided schema for validation', () => {
        const mockFilePath = 'config.json';
        const mockJsonData = { name: 'TestApp' };
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        (path.extname as jest.Mock).mockReturnValue('.json');  // Simulate the file extension

        // Create a schema that requires a "name" field
        const schema = z.object({
            name: z.string().min(3),
        });

        const appConfig = new AppConfig(mockFilePath, schema);
        
        expect(appConfig.config).toEqual(mockJsonData);
    });

    test('should throw an error if the config does not match the schema', () => {
        const mockFilePath = 'config.json';
        const mockJsonData = { name: 'A' };  // This will fail the schema validation
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        (path.extname as jest.Mock).mockReturnValue('.json');  // Simulate the file extension

        const schema = z.object({
            name: z.string().min(3),  // Name should be at least 3 characters
        });

        expect(() => {
            new AppConfig(mockFilePath, schema);
        }).toThrow('Invalid input');
    });

    test('should create AppConfig using createAppConfig function', () => {
        const mockFilePath = 'config.json';
        const mockJsonData = { name: 'TestApp', version: '1.0.0' };
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        (path.extname as jest.Mock).mockReturnValue('.json');  // Simulate the file extension
        
        const appConfig = createAppConfig({
            filePath: mockFilePath,
            schema: z.object({ name: z.string() })
        });

        expect(appConfig.config).toEqual(mockJsonData);
    });
});
