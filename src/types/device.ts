export enum DeviceType {
  Android = 'ANDROID',
  Ios = 'IOS',
  Web = 'WEB',
}

export interface RegisterDevice {
  deviceToken: string;
  deviceType: DeviceType;
  appVersion: string;
}
