import { z } from 'zod';
import {
  businessTypes,
  launchTimingOptions,
  primaryGoals,
  productCountOptions,
  storeFeatures,
} from '../data/site';

const MAX_MESSAGE = 2000;
const MAX_NAME = 120;
const MAX_URL = 300;

const businessTypeEnum = z.enum(businessTypes as unknown as [string, ...string[]]);
const productCountEnum = z.enum(productCountOptions as unknown as [string, ...string[]]);
const primaryGoalEnum = z.enum(primaryGoals as unknown as [string, ...string[]]);
const storeFeatureEnum = z.enum(storeFeatures as unknown as [string, ...string[]]);
const launchTimingEnum = z.enum(launchTimingOptions as unknown as [string, ...string[]]);

export const portfolioLeadSchema = z.object({
  name: z.string().trim().min(2).max(MAX_NAME),
  email: z.email().max(254),
  businessName: z.union([z.string().trim().max(160), z.literal('')]).optional(),
  businessType: businessTypeEnum,
  existingWebsite: z.union([z.string().trim().max(MAX_URL), z.literal('')]).optional(),
  productCount: productCountEnum,
  primaryGoal: primaryGoalEnum,
  neededFeatures: z.array(storeFeatureEnum).max(storeFeatures.length).default([]),
  launchTiming: launchTimingEnum,
  message: z.union([z.string().trim().max(MAX_MESSAGE), z.literal('')]).optional(),
  consent: z.literal(true),
  website: z.union([z.string().max(0), z.literal('')]).optional(), // honeypot
  turnstileToken: z.string().min(1).max(4000),
});

export type PortfolioLeadInput = z.infer<typeof portfolioLeadSchema>;

export const ALLOWED_LEAD_FIELDS = [
  'name',
  'email',
  'businessName',
  'businessType',
  'existingWebsite',
  'productCount',
  'primaryGoal',
  'neededFeatures',
  'launchTiming',
  'message',
  'consent',
  'website',
  'turnstileToken',
] as const;

export function redactLeadForLogs(input: Partial<PortfolioLeadInput>) {
  return {
    businessType: input.businessType,
    productCount: input.productCount,
    primaryGoal: input.primaryGoal,
    launchTiming: input.launchTiming,
    neededFeaturesCount: input.neededFeatures?.length ?? 0,
    hasMessage: Boolean(input.message),
    consent: input.consent === true,
  };
}
