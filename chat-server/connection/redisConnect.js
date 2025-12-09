import { createClient } from "redis";

// Use Docker service name for Redis when running in docker-compose
// Fallback to localhost for non-Docker/local development
const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = process.env.REDIS_PORT || "6379";

const redis = createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});

redis.on("error", err => console.error("Redis Error:", err));

await redis.connect();

export default redis;
