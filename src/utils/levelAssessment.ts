
/**
 * Assesses the level based on a score out of 20
 * @param score Score on a scale of 0-20
 * @returns Object containing level (1-4) and description
 */
export const assessLevel = (score: number): {level: number, description: string} => {
  if (score <= 7) {
    return { level: 1, description: "Basic knowledge" };
  } else if (score <= 12) {
    return { level: 2, description: "Intermediate knowledge" };
  } else if (score <= 16) {
    return { level: 3, description: "Advanced knowledge" };
  } else {
    return { level: 4, description: "Expert knowledge" };
  }
};
