import { Test, TestingModule } from '@nestjs/testing';
import { SpotsService } from './spots-core.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from 'fixtures/events';

describe('SpotsService', () => {
  let service: SpotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<SpotsService>(SpotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
