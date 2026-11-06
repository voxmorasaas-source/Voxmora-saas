import 'server-only';
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors';
import type { TenantContext, UserRole } from '@/types/auth';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

export async function requireTenantAuth(
  req: NextRequest,
  minimumRole: UserRole = 'member'
): Promise<TenantContext> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new UnauthorizedError('Invalid or expired authentication session');
  }

  // Resolve organization ID from request header or search param
  const orgId = req.headers.get('x-organization-id') || req.nextUrl.searchParams.get('orgId');
  if (!orgId) {
    throw new ForbiddenError('Missing organization context header (x-organization-id)');
  }

  // Verify membership and role in organization
  const { data: membership, error: memberError } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', orgId)
    .eq('user_id', user.id)
    .single();

  if (memberError || !membership) {
    throw new ForbiddenError('You do not belong to this organization');
  }

  const userRole = (membership as { role: UserRole }).role;
  if (ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[minimumRole]) {
    throw new ForbiddenError(`Action requires ${minimumRole} privileges`);
  }

  return {
    userId: user.id,
    userEmail: user.email || '',
    organizationId: orgId,
    role: userRole,
  };
}
