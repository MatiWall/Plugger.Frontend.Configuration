import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { createAppConfig, ConfigType } from './AppConfig';
import { AppConfigProvider, useAppConfig } from './AppConfigProvider';

import '@testing-library/jest-dom';

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');
jest.mock('yaml', () => ({
  parse: jest.fn()
}));

// Mock data for testing
const mockConfig: ConfigType = {
  app: { title: 'Test App', url: 'https://test.com' },
  environment: 'test',
  extensions: {},
};

const appConfig = createAppConfig({config: mockConfig});

// Test component that uses `useAppConfig`
const TestComponent = () => {
  const config = useAppConfig();
  return (
    <div>
      <h1>{config.app.title}</h1>
      <p>{config.app.url}</p>
    </div>
  );
};

describe('AppConfigProvider', () => {


  test('provides the correct config to the children component', () => {
    const appConfig = createAppConfig({config: mockConfig});
    render(
      <AppConfigProvider appConfig={appConfig}>
        <TestComponent />
      </AppConfigProvider>
    );

    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
  });

  test('throws an error when useAppConfig is used outside the provider', () => {

      expect(() => render(<TestComponent />)).toThrow(
        'useAppConfig must be used within an AppConfigProvider'
      );
  });

  test('works with undefined filePath and config', () => {
    const appConfig = createAppConfig({config: mockConfig});
    render(
      <AppConfigProvider appConfig={appConfig}>
        <TestComponent />
      </AppConfigProvider>
    );

    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
  });
});
