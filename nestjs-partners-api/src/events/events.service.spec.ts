import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';
import { fakeEvents, prismaMock } from '../fixtures/events';

describe('EventsService', () => {
  let service: EventsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it(`should return an array of events`, async () => {
      const response = await service.findAll();

      expect(response).toEqual(fakeEvents);
      expect(prisma.event.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.event.findMany).toHaveBeenCalledWith(/* nothing */);
    });
  });
});
