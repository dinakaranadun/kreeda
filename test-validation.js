import { listMatchesQuerySchema, MATCH_STATUS, matchIdParamSchema, createMatchSchema, updateScoreSchema } from './src/validation/matches.js';

console.log('Testing listMatchesQuerySchema...');
try {
  const valid = listMatchesQuerySchema.parse({ limit: '50' });
  console.log('Valid:', valid);
  const invalid = listMatchesQuerySchema.parse({ limit: '150' });
} catch (e) {
  console.log('Expected error for limit > 100:', e.message);
}

console.log('MATCH_STATUS:', MATCH_STATUS);

console.log('Testing matchIdParamSchema...');
try {
  const valid = matchIdParamSchema.parse({ id: '123' });
  console.log('Valid:', valid);
  const invalid = matchIdParamSchema.parse({ id: '-1' });
} catch (e) {
  console.log('Expected error for negative id:', e.message);
}

console.log('Testing createMatchSchema...');
try {
  const valid = createMatchSchema.parse({
    sport: 'Football',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    startTime: '2023-10-01T10:00:00.000Z',
    endTime: '2023-10-01T12:00:00.000Z',
    homeScore: 2,
    awayScore: 1
  });
  console.log('Valid:', valid);
} catch (e) {
  console.log('Error:', e.message);
}

try {
  const invalid = createMatchSchema.parse({
    sport: '',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    startTime: 'invalid',
    endTime: '2023-10-01T08:00:00.000Z'
  });
} catch (e) {
  console.log('Expected errors:', e.message);
}

console.log('Testing updateScoreSchema...');
try {
  const valid = updateScoreSchema.parse({ homeScore: '3', awayScore: '2' });
  console.log('Valid:', valid);
  const invalid = updateScoreSchema.parse({ homeScore: '-1' });
} catch (e) {
  console.log('Expected error for negative score:', e.message);
}
