export const fakeEvents = [
  {
    name: 'First Event',
    description: 'description',
    date: '2024-07-09T16:32:55Z',
    price: 30,
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
};
