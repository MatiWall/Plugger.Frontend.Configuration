// AppConfigProvider.test.tsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AppConfig } from './AppConfig';
import { AppConfigProvider, useAppConfig } from './AppConfigProvider';

// Mock data for testing
const mockConfig = {
  app: { title: 'Test App', url: 'https://test.com' },
  extensions: {},
};

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
  it('provides the correct config to the children component', () => {
    const appConfig = new AppConfig(undefined, mockConfig);
    render(
      <AppConfigProvider appConfig={appConfig}>
        <TestComponent />
      </AppConfigProvider>
    );

    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
  });

  it('throws an error when useAppConfig is used outside the provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    act(() => {
      expect(() => render(<TestComponent />)).toThrowError(
        'useAppConfig must be used within an AppConfigProvider'
      );
    });

    consoleError.mockRestore();
  });

  it('works with undefined filePath and config', () => {
    const appConfig = new AppConfig(undefined, mockConfig);
    render(
      <AppConfigProvider appConfig={appConfig}>
        <TestComponent />
      </AppConfigProvider>
    );

    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
  });
});
