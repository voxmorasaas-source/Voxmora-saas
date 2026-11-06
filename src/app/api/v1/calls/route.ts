import { NextRequest } from 'next/server';
import { requireTenantAuth } from '@/server/policies/tenant-guard';
import { CallRepository } from '@/server/repositories/call.repository';
import { callQuerySchema } from '@/schemas/call.schema';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireTenantAuth(req, 'member');
    const { searchParams } = req.nextUrl;

    const query = callQuerySchema.parse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
      status: searchParams.get('status') || undefined,
      outcome: searchParams.get('outcome') || undefined,
      search: searchParams.get('search') || undefined,
    });

    const repo = new CallRepository();
    const result = await repo.listByOrg(ctx.organizationId, query);

    return successResponse(result.items, 200, {
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / query.limit),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

