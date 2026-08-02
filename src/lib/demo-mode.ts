export function isDemoMode(value?: string | boolean | null): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() !== 'false' && value !== '0';
  }
  // Default to demo mode for this portfolio repository.
  return true;
}

export function getDemoRobots(): string {
  return 'noindex, nofollow';
}

export function shouldEmitProductSchema(demoMode: boolean): boolean {
  return !demoMode;
}
