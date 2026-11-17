export type AttachmentLink = { name: string; url: string };

/** Extract `[Attached File: name (url)]` markers from project details. */
export function extractAttachmentLinks(projectDetails: string): AttachmentLink[] {
  const links: AttachmentLink[] = [];
  const re = /\[Attached File:\s*([^\]]+?)\s*\((https?:\/\/[^)\s]+)\)\]/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(projectDetails)) !== null) {
    links.push({ name: match[1].trim(), url: match[2].trim() });
  }
  return links;
}
