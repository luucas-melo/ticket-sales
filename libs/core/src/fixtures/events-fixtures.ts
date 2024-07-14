export const fakeEvents = [
  {
    name: 'First Event',
    description: 'description',
    date: '2024-07-09T16:32:55Z',
    price: 30,
  },
];

export const fakeSpots = [
  {
    name: 'A1',
  },
  {
    name: 'A2',
  },
  {
    name: 'A3',
  },
];

export const prismaMock = {
  event: {
    create: jest.fn().mockReturnValue(fakeEvents[0]),
    findMany: jest.fn().mockResolvedValue(fakeEvents),
    findUnique: jest.fn().mockResolvedValue(fakeEvents[0]),
    update: jest.fn().mockResolvedValue(fakeEvents[0]),
    delete: jest.fn(),
  },
  spot: {
    create: jest.fn().mockReturnValue(fakeSpots[0]),
    findMany: jest.fn().mockResolvedValue(fakeSpots),
    findUnique: jest.fn().mockResolvedValue(fakeSpots[0]),
    update: jest.fn().mockResolvedValue(fakeSpots[0]),
    delete: jest.fn(),
  },
};
