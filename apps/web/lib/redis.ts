import Redis from "ioredis";

declare global {
  var __redis: Redis | undefined;
}

const redis = global.__redis ?? new Redis(process.env.UPSTASH_REDIS_URL!, {
  tls: { rejectUnauthorized: false },
});

if (!global.__redis) {
  global.__redis = redis;
}

export default redis;
