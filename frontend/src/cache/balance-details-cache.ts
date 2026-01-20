import { BalanceDetailed } from "../models";

const balanceDetailsCache = new Map<string, BalanceDetailed[]>();

const cacheKey = (groupId: string, userId: string) => `${groupId}:${userId}`;

export const getCachedBalanceDetails = (
  groupId: string,
  userId: string,
): BalanceDetailed[] | null =>
  balanceDetailsCache.get(cacheKey(groupId, userId)) ?? null;

export const hasCachedBalanceDetails = (
  groupId: string,
  userId: string,
): boolean => balanceDetailsCache.has(cacheKey(groupId, userId));

export const setCachedBalanceDetails = (
  groupId: string,
  userId: string,
  balances: BalanceDetailed[],
): void => {
  balanceDetailsCache.set(cacheKey(groupId, userId), balances);
};

export const clearBalanceDetailsCacheForGroup = (groupId: string): void => {
  const prefix = `${groupId}:`;
  for (const key of balanceDetailsCache.keys()) {
    if (key.startsWith(prefix)) {
      balanceDetailsCache.delete(key);
    }
  }
};
