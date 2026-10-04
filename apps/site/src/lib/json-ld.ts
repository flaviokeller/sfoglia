/**
 * Serialises structured data for an inline `<script type="application/ld+json">`.
 *
 * JSON.stringify alone is not safe there: an editor typing `</script>` into an
 * FAQ answer would close the tag early and break the page. Escaping `<` keeps
 * the JSON identical to parsers while making it inert as HTML.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
