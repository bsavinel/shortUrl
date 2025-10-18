import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { shortUrl, ShortUrlType } from '@prisma/client';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(private readonly prisma: PrismaService) {}

  async createShortUrl(url: string): Promise<shortUrl> {
    const existingUrl = await this.prisma.url.findUnique({
      where: {
        url,
      },
      include: {
        shortUrl: true,
      },
    });
    if (existingUrl) {
      return existingUrl.shortUrl[0];
    }

    const shortUrl = nanoid(6);
    const createdUrl = await this.prisma.url.create({
      data: {
        url,
        shortUrl: {
          create: {
            shortUrl,
            type: ShortUrlType.DEFAULT,
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
    const url = await this.prisma.shortUrl.findUnique({
      where: {
        shortUrl,
      },
      include: {
        url: true,
      },
    });
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    return url;
  }
}
