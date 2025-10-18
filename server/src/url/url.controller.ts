import { Controller, Post, Body, Get, Param, BadRequestException } from '@nestjs/common';
import { UrlService } from './url.service';
import { shortUrl } from '@prisma/client';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  createShortUrl(@Body('url') url: string): Promise<shortUrl> {
	console.log(url);
	if (!url) {
		throw new BadRequestException('URL is required');
	}
    return this.urlService.createShortUrl(url);
  }

  @Get(':shortUrl')
  getShortUrl(@Param('shortUrl') shortUrl: string): Promise<shortUrl> {
    return this.urlService.getShortUrl(shortUrl);
  }
}