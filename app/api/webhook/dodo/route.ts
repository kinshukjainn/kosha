// app/api/webhook/dodo/route.ts
import { Webhooks } from "@dodopayments/nextjs";
import { sql } from "@/lib/db";

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,

  // Keep while confirming the payload, then trim
  onPayload: async (payload) => {
    console.log("[dodo]", payload.type, JSON.stringify(payload.data));
  },

  onSubscriptionActive: async (payload) => {
    const d = payload.data;
    const clerkId = d.metadata?.clerk_id;
    if (!clerkId) return; // first activation must carry clerk_id (set at checkout)
    await sql`
      UPDATE users SET
        plan_id              = 'pro',
        subscription_status  = 'active',
        dodo_customer_id     = ${d.customer.customer_id},
        dodo_subscription_id = ${d.subscription_id},
        current_period_end   = ${d.next_billing_date},
        updated_at           = NOW()
      WHERE clerk_id = ${clerkId}`;
  },

  onSubscriptionRenewed: async (payload) => {
    const d = payload.data;
    await sql`
      UPDATE users SET
        plan_id = 'pro', subscription_status = 'active',
        current_period_end = ${d.next_billing_date}, updated_at = NOW()
      WHERE dodo_subscription_id = ${d.subscription_id}`;
  },

  onSubscriptionOnHold: async (payload) => {
    const d = payload.data;
    await sql`UPDATE users SET subscription_status = 'on_hold', updated_at = NOW()
              WHERE dodo_subscription_id = ${d.subscription_id}`;
  },

  onSubscriptionCancelled: async (payload) => {
    const d = payload.data;
    await sql`UPDATE users SET subscription_status = 'cancelled', updated_at = NOW()
              WHERE dodo_subscription_id = ${d.subscription_id}`;
  },

  onSubscriptionExpired: async (payload) => {
    const d = payload.data;
    await sql`UPDATE users SET plan_id = 'free', subscription_status = 'expired', updated_at = NOW()
              WHERE dodo_subscription_id = ${d.subscription_id}`;
  },

  onSubscriptionFailed: async (payload) => {
    const d = payload.data;
    await sql`UPDATE users SET plan_id = 'free', subscription_status = 'failed', updated_at = NOW()
              WHERE dodo_subscription_id = ${d.subscription_id}`;
  },
});
