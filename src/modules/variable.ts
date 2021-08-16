import { api } from "actionhero";
import { Redis } from "ioredis";

const hsetKey = "variable";

export async function set(key: string, value: string) {
  // const response = await redis().set(key, value);
  const data = { [key]: value };
  return await redis().hset(hsetKey, data);
}

export async function get(field: string) {
  const value = await redis().hget(hsetKey, field);
  return value;
}

export async function getAll() {
  const values = await redis().hgetall(hsetKey);
  return values;
}

export function redis() {
  return api.redis.clients["client"] as Redis;
}
