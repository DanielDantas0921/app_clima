export type WindCardinalDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SO' | 'O' | 'NO';

export function getWindDirection(degrees: number): WindCardinalDirection {
  const normalizedDegrees = ((degrees % 360) + 360) % 360;

  if (normalizedDegrees >= 0 && normalizedDegrees < 22.5) {
    return 'N';
  }

  if (normalizedDegrees >= 22.5 && normalizedDegrees < 67.5) {
    return 'NE';
  }

  if (normalizedDegrees >= 67.5 && normalizedDegrees < 112.5) {
    return 'E';
  }

  if (normalizedDegrees >= 112.5 && normalizedDegrees < 157.5) {
    return 'SE';
  }

  if (normalizedDegrees >= 157.5 && normalizedDegrees < 202.5) {
    return 'S';
  }

  if (normalizedDegrees >= 202.5 && normalizedDegrees < 247.5) {
    return 'SO';
  }

  if (normalizedDegrees >= 247.5 && normalizedDegrees < 292.5) {
    return 'O';
  }

  if (normalizedDegrees >= 292.5 && normalizedDegrees < 337.5) {
    return 'NO';
  }

  return 'N';
}
