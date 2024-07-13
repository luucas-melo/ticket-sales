import {
  BadRequestException,
  HttpCode,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}
  create(createEventDto: CreateEventDto) {
    try {
      return this.prismaService.event.create({
        data: { ...createEventDto, date: new Date(createEventDto.date) },
      });
    } catch (error) {
      throw new BadRequestException('Unable to create event');
    }
  }

  findAll() {
    try {
      return this.prismaService.event.findMany();
    } catch (error) {
      throw error;
    }
  }

  findOne(id: string) {
    try {
      return this.prismaService.event.findUnique({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    try {
      return this.prismaService.event.update({
        where: { id },
        data: { ...updateEventDto, date: new Date(updateEventDto.date) },
      });
    } catch (error) {
      throw new BadRequestException('Unable to update event');
    }
  }

  @HttpCode(204)
  remove(id: string) {
    return this.prismaService.event.delete({
      where: { id },
    });
  }

  async reservSpot(dto: ReserveSpotDto & { eventId: string }) {
    try {
      const spots = await this.prismaService.spot.findMany({
        where: {
          eventId: dto.eventId,
          name: {
            in: dto.spots,
          },
        },
      });
      if (spots.length !== dto.spots.length) {
        const foundSpotsName = spots.map((spot) => spot.name);
        const notFoundSpotsName = dto.spots.filter(
          (spotName) => !foundSpotsName.includes(spotName),
        );
        throw new NotFoundException(
          `Spots ${notFoundSpotsName.join(', ')} not found`,
        );
      }
      const tickets = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => ({
              spotId: spot.id,
              ticketKind: dto.ticket_kind,
              email: dto.email,
              status: TicketStatus.reserved,
            })),
          });

          await prisma.spot.updateMany({
            where: {
              id: {
                in: spots.map((spot) => spot.id),
              },
            },
            data: {
              status: SpotStatus.reserved,
            },
          });

          const tickets = await Promise.all(
            spots.map((spot) =>
              prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  ticketKind: dto.ticket_kind,
                  email: dto.email,
                },
                include: {
                  Spot: true,
                },
              }),
            ),
          );

          return tickets;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
      return tickets;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002': // unique constraint violation
          case 'P2034': // transaction conflict
            throw new Error('Some spots are already reserved');
        }
      }
      throw error;
    }
  }
}
