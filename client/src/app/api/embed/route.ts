import { setupEmbedPlugin } from '@metageeks.tech/meta-embed';
import { NextRequest } from 'next/server';

const embedPluginHandler = setupEmbedPlugin();

export async function GET(req: NextRequest) {
  return embedPluginHandler(req);
}