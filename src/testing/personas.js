export const PERSONAS = [
  {
    id: 'idealistic-rebel',
    name: '理想主义反叛者',
    expectedScores: { freedom: 9, moral: 4, realism: 5, fatalism: 2, cause: 4 },
    expectedTopDimensions: ['freedom', 'realism'],
    picks: [0, 1, 1, 1, 0, 0, 1, 0, 0, 2],
  },
  {
    id: 'collective-strategist',
    name: '集体主义战略家',
    expectedScores: { freedom: 5, moral: 8, realism: 9, fatalism: 5, cause: 9 },
    expectedTopDimensions: ['cause', 'realism'],
    picks: [2, 0, 2, 0, 2, 1, 0, 0, 2, 0],
  },
  {
    id: 'protective-caregiver',
    name: '守护型照料者',
    expectedScores: { freedom: 4, moral: 5, realism: 5, fatalism: 6, cause: 3 },
    expectedTopDimensions: ['fatalism', 'moral'],
    picks: [1, 2, 0, 2, 1, 2, 2, 1, 1, 1],
  },
  {
    id: 'pragmatic-mediator',
    name: '现实主义调停者',
    expectedScores: { freedom: 6, moral: 6, realism: 9, fatalism: 4, cause: 7 },
    expectedTopDimensions: ['realism', 'cause'],
    picks: [2, 2, 2, 1, 2, 0, 0, 0, 2, 0],
  },
  {
    id: 'fatalistic-survivor',
    name: '宿命型幸存者',
    expectedScores: { freedom: 3, moral: 6, realism: 7, fatalism: 9, cause: 6 },
    expectedTopDimensions: ['fatalism', 'realism'],
    picks: [1, 2, 0, 1, 1, 1, 2, 1, 1, 1],
  },
  {
    id: 'conflicted-soldier',
    name: '矛盾型士兵',
    expectedScores: { freedom: 5, moral: 7, realism: 8, fatalism: 7, cause: 8 },
    expectedTopDimensions: ['cause', 'realism'],
    picks: [2, 2, 2, 0, 2, 1, 0, 0, 2, 1],
  },
];
