export type SlugDocument = {
  title: string;
  doc_number: string;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function documentSlug(doc: SlugDocument) {
  const title = slugify(doc.title) || "document";
  const number = slugify(doc.doc_number);
  return number ? `${title}-${number}` : title;
}