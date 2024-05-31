import { open } from "lmdb";

const db = open({
    path: "analytics"
});

export async function addArticleView(articleId: string) {
    let articleViews = db.get("articleViews") || {};
    articleViews[articleId] = (articleViews[articleId] || 0) + 1;
    await db.put("articleViews", articleViews);

    return articleViews[articleId];
}

export function getArticleViews(articleId: string) {
    let articleViews = db.get("articleViews") || {};
    return articleViews[articleId] || 0;
}

export function getAllArticleViews() {
    return db.get("articleViews") || {};
}

export function getUserIP(request: Request): string {
    const headers = [
        // Cloudflare
        "cf-connecting-ip",
        // NGINX
        "x-real-ip",
        // Standard
        "x-forwarded-for",
        "x-client-ip",
    ]

    for (const header of headers) {
        const value = request.headers.get(header);
        if (value !== null) return value;
    }

    return "1.1.1.1";
}
