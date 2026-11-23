import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cz.aardvarkland.wmsmini',
  appName: 'Aardvarkland WMS-Mini',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // Navigation with a query bypasses the browser worker's old cached shell.
    appStartPath: '/?native=1',
  },
  android: {
    minSdkVersion: 24,
  },
};

export default config;
