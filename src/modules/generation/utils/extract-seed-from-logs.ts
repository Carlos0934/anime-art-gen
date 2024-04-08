function extractSeedFromLogs(logs: string): number {
  const seedMatch = logs.match(/seed: (\d+)/);
  if (!seedMatch) {
    throw new Error("Seed not found in logs");
  }
  const seed = parseInt(seedMatch[1]);

  if (isNaN(seed)) {
    throw new Error("Invalid seed");
  }

  return seed;
}
