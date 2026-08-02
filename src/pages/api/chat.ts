import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { products } from '../../data/products';
import { formatCad } from '../../lib/money';
import {
  MAX_JSON_BYTES,
  chatRateLimiter,
  isAllowedOrigin,
  parseAllowedOrigins,
} from '../../lib/security';

export const prerender = false;

const chatSchema = z.object({
  message: z.string().trim().min(1).max(500),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
    const origin = request.headers.get('origin');
    if (!isAllowedOrigin(origin, allowedOrigins)) {
      return json({ reply: 'Request not allowed from this origin.' }, 403);
    }

    if (request.headers.get('content-type')?.includes('application/json') !== true) {
      return json({ reply: 'Unsupported content type.' }, 415);
    }

    const raw = await request.text();
    if (raw.length > MAX_JSON_BYTES) {
      return json({ reply: 'Message too large.' }, 413);
    }

    const parsed = chatSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return json({ reply: 'Please send a shorter message about the demo catalogue.' }, 400);
    }

    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';
    const rate = chatRateLimiter.check(ip);
    if (!rate.allowed) {
      return json({ reply: 'Please wait a moment before sending another message.' }, 429);
    }

    const message = parsed.data.message.toLowerCase();

    if (/payment|credit card|card number|cvv|password/i.test(message)) {
      return json({
        reply:
          'I cannot take payment-card details. This is a fictional store demonstration by Che Xu Studio with no live payments.',
      });
    }

    if (message.includes('build a store') || message.includes('che xu')) {
      return json({
        reply:
          'Che Xu Studio builds fast, conversion-focused online stores with product discovery, accessible carts and SEO architecture. Use Request My Store Plan to start a consented enquiry—I will not pretend an order was completed.',
        suggestEnquiry: true,
      });
    }

    if (message.includes('checkout')) {
      return json({
        reply:
          'The demo checkout walks through contact, sample delivery, sample shipping details and review. No order, shipment or payment is created, and checkout values stay in your browser.',
      });
    }

    if (message.includes('gift')) {
      const gifts = products.filter((product) => product.collection === 'gifts').slice(0, 3);
      return json({
        reply: `Gift ideas from the fictional catalogue: ${gifts
          .map((product) => `${product.name} (${formatCad(product.price)})`)
          .join('; ')}. Open any product page for variants and care details.`,
      });
    }

    if (
      message.includes('room') ||
      message.includes('living') ||
      message.includes('kitchen') ||
      message.includes('workspace')
    ) {
      return json({
        reply:
          'You can shop by room from the homepage or use filters for living-room, dining-area, kitchen and workspace. I only recommend products that exist in this demo catalogue.',
      });
    }

    if (message.includes('compare')) {
      const a = products[0]!;
      const b = products[1]!;
      return json({
        reply: `Example comparison from demo data: ${a.name} (${formatCad(a.price)}, ${a.materials.join(', ')}) vs ${b.name} (${formatCad(b.price)}, ${b.materials.join(', ')}). I will not invent specifications.`,
      });
    }

    const match = products.find(
      (product) =>
        message.includes(product.name.toLowerCase()) ||
        message.includes(product.slug.replaceAll('-', ' ')) ||
        product.categories.some((category) => message.includes(category)),
    );

    if (match) {
      return json({
        reply: `${match.name} is a fictional catalogue item priced at ${formatCad(match.price)}. Variants: ${match.variants
          .map((variant) => variant.label)
          .join(', ')}. I can add it to the demo cart after you confirm.`,
        confirmAdd: {
          productId: match.id,
          variantId: match.variants.find((variant) => variant.available)?.id ?? match.variants[0]?.id,
          name: match.name,
        },
      });
    }

    if (message.includes('find') || message.includes('help') || message.includes('product')) {
      const featured = products.filter((product) => product.featured).slice(0, 3);
      return json({
        reply: `Here are featured fictional products: ${featured
          .map((product) => `${product.name} (${formatCad(product.price)})`)
          .join('; ')}. Ask about a product name to compare details or confirm a demo-cart add.`,
      });
    }

    const ai = env.AI;
    if (ai) {
      try {
        const result = (await ai.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            {
              role: 'system',
              content:
                'You are an AI shopping assistant in a fictional store demonstration created by Che Xu Studio. Never claim Harbour & Pine Home is real, never invent product specs, discounts, stock, payments or human identity. Keep replies under 120 words.',
            },
            { role: 'user', content: parsed.data.message.slice(0, 500) },
          ],
          max_tokens: 180,
        })) as { response?: string };
        if (result.response) {
          return json({ reply: result.response.slice(0, 800) });
        }
      } catch {
        // Fall through to deterministic reply.
      }
    }

    return json({
      reply:
        'I can help you find fictional products, explain variants, describe the demo checkout, or start a Che Xu Studio enquiry. Harbour & Pine Home is not a real store.',
    });
  } catch {
    return json({ reply: 'Something went wrong. Please try again.' }, 500);
  }
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
