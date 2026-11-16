// src/bookings/bookings.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService, BookingStatus } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface CreateBookingDto {
  serviceId: string;
  clientId: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
}

export interface UpdateBookingStatusDto {
  status: BookingStatus;
}

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async getBookings(user: AuthenticatedUser, page = 1, limit = 20) {
    let where: any = { deletedAt: null };

    if (user.role === 'PROFESSIONAL' || user.role === 'STUDIO_OWNER') {
      const profile = await this.prisma.professionalProfile.findUnique({
        where: { userId: user.id },
      });
      if (!profile) {
        throw new NotFoundException('Professional profile not found');
      }
      where.professionalId = profile.id;
    } else if (user.role === 'CLIENT') {
      const client = await this.prisma.client.findUnique({
        where: { userId: user.id },
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      where.clientId = client.id;
    }

    const [bookings, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startTime: 'desc' },
        include: {
          client: true,
          service: true,
          professional: true,
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { bookings, total, page, limit };
  }

  async createBooking(user: AuthenticatedUser, dto: CreateBookingDto) {
    let clientId: string;

    if (user.role === 'CLIENT') {
      const client = await this.prisma.client.findUnique({
        where: { userId: user.id },
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      clientId = client.id;
    } else {
      clientId = dto.clientId;
    }

    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });

    if (!service || service.deletedAt) {
      throw new NotFoundException('Service not found');
    }

    const professional = await this.prisma.professionalProfile.findUnique({
      where: { id: service.professionalId },
    });

    if (!professional || professional.deletedAt) {
      throw new NotFoundException('Professional not found');
    }

    if (user.role === 'PROFESSIONAL' && professional.userId !== user.id) {
      throw new ForbiddenException('You can only create bookings for your own services');
    }

    const conflicting = await this.prisma.booking.findFirst({
      where: {
        serviceId: dto.serviceId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        deletedAt: null,
        OR: [
          {
            startTime: { lt: dto.endTime },
            endTime: { gt: dto.startTime },
          },
        ],
      },
    });

    if (conflicting) {
      throw new BadRequestException('Time slot is already booked');
    }

    return this.prisma.booking.create({
      data: {
        professionalId: professional.id,
        clientId,
        serviceId: dto.serviceId,
        startTime: dto.startTime,
        endTime: dto.endTime,
        status: 'PENDING',
        totalAmount: service.price,
        notes: dto.notes,
      },
      include: {
        client: true,
        service: true,
      },
    });
  }

  async getBooking(user: AuthenticatedUser, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        service: true,
        professional: true,
        reviews: true,
      },
    });

    if (!booking || booking.deletedAt) {
      throw new NotFoundException('Booking not found');
    }

    if (user.role === 'PROFESSIONAL' || user.role === 'STUDIO_OWNER') {
      const profile = await this.prisma.professionalProfile.findUnique({
        where: { userId: user.id },
      });
      if (booking.professionalId !== profile?.id) {
        throw new ForbiddenException('You can only access your own bookings');
      }
    } else if (user.role === 'CLIENT') {
      const client = await this.prisma.client.findUnique({
        where: { userId: user.id },
      });
      if (booking.clientId !== client?.id) {
        throw new ForbiddenException('You can only access your own bookings');
      }
    }

    return booking;
  }

  async updateBookingStatus(user: AuthenticatedUser, bookingId: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.deletedAt) {
      throw new NotFoundException('Booking not found');
    }

    if (user.role === 'PROFESSIONAL' || user.role === 'STUDIO_OWNER') {
      const profile = await this.prisma.professionalProfile.findUnique({
        where: { userId: user.id },
      });
      if (booking.professionalId !== profile?.id) {
        throw new ForbiddenException('You can only update your own bookings');
      }
    } else {
      throw new ForbiddenException('Only professionals can update booking status');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: dto.status },
    });
  }
}