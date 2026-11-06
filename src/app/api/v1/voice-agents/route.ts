import { NextRequest } from 'next/server';
import { requireTenantAuth } from '@/server/policies/tenant-guard';
import { VoiceAgentService } from '@/server/services/voice-agent.service';
import { createVoiceAgentSchema } from '@/schemas/voice-agent.schema';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireTenantAuth(req, 'member');
    const service = new VoiceAgentService();
    const agents = await service.listAgents(ctx);
    return successResponse(agents);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await requireTenantAuth(req, 'admin');
    const body = await req.json();
    const validatedData = createVoiceAgentSchema.parse(body);

    const service = new VoiceAgentService();
    const newAgent = await service.createAgent(ctx, validatedData);

    return successResponse(newAgent, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

