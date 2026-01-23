import { NextRequest } from 'next/server';
import { MembershipWebhookService } from '../../../../lib/services/membership-webhook-service';

// Create webhook service instance
const webhookService = new MembershipWebhookService();

/**
 * Handle POST requests to membership webhook endpoint
 */
export async function POST(request: NextRequest) {
  return await webhookService.handleWebhook(request);
}

/**
 * Handle GET requests (for webhook verification if needed)
 */
export async function GET() {
  return new Response('Membership webhook endpoint is active', { 
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}