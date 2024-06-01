import fs from "node:fs";
import type { Article } from "../types";

export function initializeBlogPosts(): Article[] {
    const folder = Bun.env.BLOG_POSTS_DIR ?? "./articles";
    const files = fs.readdirSync(folder).filter((file) => file.endsWith(".md"));
    return files.map((file) => {
        const filePath = `${folder}/${file}`;
        const content = fs.readFileSync(filePath, "utf-8");
        const meta = getMedata(content);

        return {
            url_name: file.replace(/\.md$/, ""),
            title: content.match(/^# (.+)$/m)?.[1] ?? "Untitled",
            published: convertTime(meta.published) ?? 0,
            meta_image: meta.meta_image ?? "/media/meta.webp",
            content: content.replace(/<!--\r?\n([\s\S]+)\r?\n-->/, "") ?? "No content found",
        };
    }).sort((a, b) => b.published - a.published);
}

export function articlesToRss(articles: Article[]): string {
    return `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
        <channel>
            <title>My Blog</title>
            <link>https://blog.northernsi.de</link>
            <description>Northernside's blog</description>
            ${articles.map((article) => `
                <item>
                    <title>${article.title}</title>
                    <link>https://blog.northernsi.de/article/${article.url_name}</link>
                    <description>${article.content.replace(/<[^>]+>/g, "").replace(/# (.+)$/gm, "").slice(1, 512)}...</description>
                    <pubDate>${new Date(article.published).toUTCString()}</pubDate>
                </item>
            `).join("")}
        </channel>
    </rss>`;
}

function getMedata(content: string): { [key: string]: string } {
    let meta = content.match(/<!--\r?\n([\s\S]+)\r?\n-->/)?.[1] ?? "";

    return meta.replaceAll("\r\n", "\n").split("\n").reduce((acc, line) => {
        const [key, value] = line.split(": ");
        acc[key] = value;
        return acc;
    }, {} as { [key: string]: string });
}

function convertTime(time: string): number {
    let [datePart, timePart] = time.split(" ");
    let [day, month, year] = datePart.split("/");
    let [hour, minute, second] = timePart.split(":");
    return new Date(+year, +month - 1, +day, +hour, +minute, +second).getTime();
}