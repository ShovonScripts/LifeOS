let deviceId: string | null = null;

export function setDeviceId(value: string): void {
  deviceId = value;
}

export function getDeviceId(): string {
  if (!deviceId) {
    throw new Error('Device id has not been initialized. Call bootstrapDatabase() first.');
  }

  return deviceId;
}
