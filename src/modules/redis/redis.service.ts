import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: this.configService.get<number>('REDIS_PORT') || 6379,
      db: this.configService.get<number>('REDIS_DB') || 0,
      password: this.configService.get<string>('REDIS_PASSWORD') || '',
    });
  }

  // Set a value in the Redis cache
  async setCache(key: string, value: string, ttl: number = 3600): Promise<void> {
    await this.redisClient.setex(key, ttl, value); // Set with expiry
  }

  // Get a value from the Redis cache
  async getCache(key: string): Promise<string | null> {
    return this.redisClient.get(key); // Returns null if key not found
  }

  // Check if the cache key exists
  async existsCache(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  // Delete a cache key
  async deleteCache(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
