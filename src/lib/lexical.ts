import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html';
import type { SerializedEditorState } from 'lexical';

/**
 * Synchronously converts a Payload Lexical editor JSON state to an HTML string on the server.
 * Keeping this on the server removes @payloadcms/richtext-lexical/react from client JS bundles.
 */
export function lexicalToHtml(data: unknown): string {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (typeof data !== 'object' || !('root' in data)) return '';

  try {
    return convertLexicalToHTML({
      data: data as SerializedEditorState,
      disableContainer: true,
    });
  } catch (err) {
    console.warn('[lexicalToHtml] Failed to convert rich text:', err instanceof Error ? err.message : err);
    return '';
  }
}
