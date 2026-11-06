import 'server-only';
import { VoiceAgentRepository } from '../repositories/voice-agent.repository';
import { BlandClient } from '@/lib/bland/client';
import { ForbiddenError, NotFoundError } from '@/lib/api/errors';
import type { TenantContext } from '@/types/auth';
import type { CreateVoiceAgentInput, UpdateVoiceAgentInput } from '@/schemas/voice-agent.schema';

export class VoiceAgentService {
  constructor(
    private readonly repo = new VoiceAgentRepository(),
    private readonly bland = new BlandClient()
  ) {}

  async createAgent(ctx: TenantContext, input: CreateVoiceAgentInput) {
    // 1. Quota check
    const existingCount = await this.repo.countByOrg(ctx.organizationId);
    if (existingCount >= 10) {
      throw new ForbiddenError('Voice agent limit reached for current organization plan');
    }

    // 2. Provision agent with Bland AI
    let blandAgentId: string | null = null;
    try {
      const blandRes = await this.bland.createAgent({
        prompt: input.systemPrompt,
        voice: input.voiceId,
        language: input.language,
        temperature: input.temperature,
        first_sentence: input.greetingMessage,
        transfer_phone_number: input.fallbackPhoneNumber,
      });
      blandAgentId = blandRes.agent_id;
    } catch (err) {
      console.warn('[VoiceAgentService] Bland AI provisioning skipped or failed, storing local record', err);
    }

    // 3. Persist agent to database
    return await this.repo.create({
      organization_id: ctx.organizationId,
      name: input.name,
      voice_id: input.voiceId,
      language: input.language,
      greeting_message: input.greetingMessage,
      system_prompt: input.systemPrompt,
      temperature: input.temperature,
      fallback_phone_number: input.fallbackPhoneNumber || null,
      transfer_keywords: input.transferKeywords,
      max_duration_seconds: input.maxDurationSeconds,
      bland_agent_id: blandAgentId,
      is_active: true,
      created_by: ctx.userId,
    });
  }

  async getAgent(ctx: TenantContext, agentId: string) {
    const agent = await this.repo.findById(ctx.organizationId, agentId);
    if (!agent) throw new NotFoundError('Voice Agent');
    return agent;
  }

  async listAgents(ctx: TenantContext) {
    return await this.repo.listByOrg(ctx.organizationId);
  }

  async updateAgent(ctx: TenantContext, agentId: string, input: UpdateVoiceAgentInput) {
    const agent = await this.getAgent(ctx, agentId);

    // Sync updates to Bland AI if configured
    if (agent.bland_agent_id) {
      try {
        await this.bland.updateAgent(agent.bland_agent_id, {
          ...(input.systemPrompt && { prompt: input.systemPrompt }),
          ...(input.voiceId && { voice: input.voiceId }),
          ...(input.greetingMessage && { first_sentence: input.greetingMessage }),
          ...(input.fallbackPhoneNumber !== undefined && { transfer_phone_number: input.fallbackPhoneNumber }),
        });
      } catch (err) {
        console.warn('[VoiceAgentService] Bland AI update failed', err);
      }
    }

    return await this.repo.update(ctx.organizationId, agentId, {
      ...(input.name && { name: input.name }),
      ...(input.voiceId && { voice_id: input.voiceId }),
      ...(input.language && { language: input.language }),
      ...(input.greetingMessage && { greeting_message: input.greetingMessage }),
      ...(input.systemPrompt && { system_prompt: input.systemPrompt }),
      ...(input.temperature !== undefined && { temperature: input.temperature }),
      ...(input.fallbackPhoneNumber !== undefined && { fallback_phone_number: input.fallbackPhoneNumber }),
      ...(input.transferKeywords && { transfer_keywords: input.transferKeywords }),
      ...(input.maxDurationSeconds && { max_duration_seconds: input.maxDurationSeconds }),
      ...(input.isActive !== undefined && { is_active: input.isActive }),
    });
  }

  async deleteAgent(ctx: TenantContext, agentId: string) {
    await this.getAgent(ctx, agentId);
    await this.repo.delete(ctx.organizationId, agentId);
  }
}

