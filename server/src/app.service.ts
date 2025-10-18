import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { shortUrl, ShortUrlType } from '@prisma/client';
import { nanoid } from 'nanoid';

@Injectable()
export class AppService {}
