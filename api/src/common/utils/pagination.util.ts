// src/common/utils/pagination.util.ts
export function parsePage(page?: string): number {
  return Math.max(1, parseInt(page ?? '1', 10));
}

export function parseLimit(limit?: string): number {
  const limitNum = parseInt(limit ?? '20', 10);
  return Math.min(Math.max(1, limitNum), 100);
}