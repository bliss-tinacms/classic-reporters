import type { APIRoute } from 'astro';
import { getConfig, getHeaderNavigation } from '../lib/data';

export const prerender = false;

export const GET: APIRoute = async () => {
  const config = (await getConfig()).data?.config ?? null;
  const navigation = (await getHeaderNavigation(config)).data?.navigation ?? null;
  const runtimeClient = process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '';
  const buildClient = import.meta.env.NEXT_PUBLIC_TINA_CLIENT_ID || '';
  return new Response(JSON.stringify({
    ok: Boolean(config && navigation),
    configSource: config?._source || 'unknown',
    siteTitle: config?.seo?.title || null,
    firstNavigationLabel: navigation?.items?.[0]?.label || null,
    runtimeClientPresent: Boolean(runtimeClient),
    buildClientPresent: Boolean(buildClient),
    runtimeClientMatchesBuild: Boolean(runtimeClient && buildClient && runtimeClient === buildClient),
    runtimeBranch: process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.TINA_BRANCH || null,
    tokenPresent: Boolean(process.env.TINA_TOKEN || import.meta.env.TINA_TOKEN),
    upstreamOverridePresent: Boolean(process.env.TINA_UPSTREAM_CONTENT_API_URL),
    directOverridePresent: Boolean(process.env.TINA_DIRECT_CONTENT_API_URL),
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  });
};
