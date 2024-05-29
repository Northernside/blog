import fs from "node:fs";
import type { Article } from "../types";

export function initializeBlogPosts(): Article[] {
    const folder = Bun.env.BLOG_POSTS_DIR ?? "./articles";
    const files = fs.readdirSync(folder).filter((file) => file.endsWith(".md"));
    return files.map((file) => {
        const filePath = `${folder}/${file}`;
        const content = fs.readFileSync(filePath, "utf-8");
        return {
            url_name: file.replace(/\.md$/, ""),
            title: content.match(/^# (.+)$/m)?.[1] ?? "Untitled",
            content,
        };
    });
}