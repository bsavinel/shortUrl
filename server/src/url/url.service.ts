import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { shortUrl, ShortUrlType } from '@prisma/client';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(private readonly prisma: PrismaService) {}

  async createShortUrl(
    url: string,
    options: {
      clickLimit?: number;
      expirationDate?: Date;
    },
  ): Promise<shortUrl> {
    if (!options.clickLimit && !options.expirationDate) {
      const existingUrl = await this.prisma.url.findFirst({
        where: {
          url,
        },
        include: {
          shortUrl: {
            where: {
              type: ShortUrlType.DEFAULT,
            },
          },
        },
      });
      if (existingUrl) {
        return existingUrl.shortUrl[0];
      }
    }

    const shortUrl = nanoid(6);
    const createdUrl = await this.prisma.url.create({
      data: {
        url,
        shortUrl: {
          create: {
            shortUrl,
            type:
              options.clickLimit || options.expirationDate
                ? ShortUrlType.LIMITED
                : ShortUrlType.DEFAULT,
            limit: options.clickLimit,
            expireAt: options.expirationDate,
          },
        },
      },
      include: {
        shortUrl: true,
      },
    });

    return createdUrl.shortUrl[0];
  }

  async getShortUrl(shortUrl: string): Promise<shortUrl> {
    const shortUrlData = await this.prisma.shortUrl.findUnique({
      where: {
        shortUrl,
      },
      include: {
        url: true,
      },
    });
    if (!shortUrlData) {
      throw new NotFoundException('Short URL not found');
    }
	await this.prisma.shortUrl.update({
      where: {
        id: shortUrlData.id,
      },
      data: {
        count: { increment: 1 },
      },
    });
    if (shortUrlData.type === ShortUrlType.LIMITED) {
      if (shortUrlData.limit && shortUrlData.count >= shortUrlData.limit) {
        throw new BadRequestException('Short URL limit reached');
      }
      if (shortUrlData.expireAt && shortUrlData.expireAt < new Date()) {
        throw new BadRequestException('Short URL expired');
      }
    }
    return shortUrlData;
  }
}
