import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { rssSchema } from "@astrojs/rss";

const blog = defineCollection({
  loader: glob({ 
    pattern: "**/*.md", 
    base: "/app/directus_uploads" 
  }),
  schema: rssSchema,
});

export const collections = { blog };
