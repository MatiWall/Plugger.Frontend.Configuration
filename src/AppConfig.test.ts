import { AppConfig, createAppConfig, ConfigType } from './AppConfig';
import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';
import configSchema from './schema';


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
        const mockJsonData = { app: { title: 'test', url: 'https://test.com'} };
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        (path.extname as jest.Mock).mockReturnValue('.json');  // Simulate the file extension
        
        const appConfig = createAppConfig({filePath: mockFilePath});

        expect(appConfig.config).toEqual(configSchema.parse(mockJsonData));
    });

    test('should load YAML config correctly', () => {
        const mockFilePath = 'config.yaml';
        const mockYamlData = { app: { title: 'test', url: 'https://test.com'} };
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue('name: TestApp\nversion: 1.0.0\n');  // Simulate YAML content
        (path.extname as jest.Mock).mockReturnValue('.yaml');  // Simulate the file extension
        (parseYaml as jest.Mock).mockReturnValue(mockYamlData);  // Mock YAML parser
        
        const appConfig = new AppConfig(mockFilePath);

        expect(appConfig.config).toEqual(configSchema.parse(mockYamlData));
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
        }).toThrow('Unsupported file format: .txt');
    });

    test('should throw an error if the config does not match the schema', () => {
        const mockFilePath = 'config.json';
        const mockJsonData = { name: 'A' };  // This will fail the schema validation
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        (path.extname as jest.Mock).mockReturnValue('.json');  // Simulate the file extension

        expect(() => {
            new AppConfig(mockFilePath);
        }).toThrow();
    });

    test('Access Extension config', ()=>{

        const extensionConfig = {
            'this': 'is the config for an extensions'
        }

        const mockJsonData: ConfigType = { 
            app: { title: 'test', url: 'https://test.com'}, 
            environment: 'test',
            extensions: {
                'component:test/test': extensionConfig
            }
        };
        
        const appConfig = createAppConfig({config: mockJsonData});


        expect(appConfig.getExtensionConfig('test', 'test', 'component')).toBe(extensionConfig);
    })
});
