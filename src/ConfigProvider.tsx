import React, { createContext, useContext } from 'react';
import { ConfigType, AppConfig } from './AppConfig';

// Create the AppConfig context with an initial undefined value
const AppConfigContext = createContext<ConfigType | undefined>(undefined);

const AppConfigProvider = ({
    children,
    appConfig,
}: {
    children: React.ReactNode;
    appConfig: AppConfig;
}) => {
    return (
        <AppConfigContext.Provider value={appConfig.config}>
            {children}
        </AppConfigContext.Provider>
    );
};

const useAppConfig = (): ConfigType => {
    const context = useContext(AppConfigContext);
    if (!context) {
        throw new Error('useAppConfig must be used within an AppConfigProvider');
    }
    return context;
};

export { AppConfigProvider, useAppConfig };
