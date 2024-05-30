import fs from "node:fs";
import { Elysia } from "elysia";

import type { Article, EightyEightByThirtyOne } from "./types";
import { articlesToRss, initializeBlogPosts } from "./misc/articles";
import { load88x31s, load88x31sHtml } from "./misc/88x31";
import { mdToHtml, mdToLiteHtml } from "./misc/markdown";

let blogPosts: Article[] = initializeBlogPosts();
let eightyEightByThirtyOnes: EightyEightByThirtyOne[] = load88x31s();
let eightyEightByThirtyOnesHtml: string = load88x31sHtml();
let imagesCache: { [key: string]: Buffer } = {};

const homeHtml = fs.readFileSync("./html/home.html", "utf-8");
const baseHtml = fs.readFileSync("./html/base.html", "utf-8");
const notFoundHtml = fs.readFileSync("./html/404.html", "utf-8");

const router = new Elysia();

/* Home */
router.get("/", ({ set }) => {
    set.headers["Content-Type"] = "text/html";

    const articles = blogPosts.map((article) =>
        `<div><div class="title-container"><a href="/article/${article.url_name}">${article.title}</a><span>(published ${new Date(article.published).toLocaleDateString()})</span></div><br>${mdToLiteHtml(article.content.slice(0, 256))}...</div>`
    ).join("");

    return homeHtml.replace("{{articles}}", articles).replace("{{88x31s}}", eightyEightByThirtyOnesHtml);
});


/* 88x31 management */
router.get("/88x31", ({ }) => eightyEightByThirtyOnes);
router.get("/88x31/:name", ({ set, params }) => {
    const banner = eightyEightByThirtyOnes.find((banner) => banner.name === params.name);
    if (!banner) { set.status = 404; return null; }

    set.headers["Content-Type"] = `image/${banner.path.split(".").pop()}`;

    if (imagesCache[banner.path]) return imagesCache[banner.path];

    imagesCache[banner.path] = fs.readFileSync(banner.path);
    return imagesCache[banner.path];
});


/* Article management */
router.get("/api/articles", ({ }) => blogPosts);
router.get("/article/:name", ({ set, params }) => {
    set.headers["Content-Type"] = "text/html";
    const article = blogPosts.find((article) => article.url_name === params.name);
    if (!article) { set.status = 404; return notFoundHtml; }

    return baseHtml
        .replace("{{title}}", article.title)
        .replace("{{meta_title}}", article.title)
        .replace(/{{meta_image}}/g, `https://blog.northernsi.de${article.meta_image}` ?? "https://blog.northernsi.de/media/meta.webp")
        .replace("{{content}}", mdToHtml(article));
});

router.get("/media/:name", ({ set, params }) => {
    const folder = Bun.env.MEDIA_DIR ?? "./media";
    const filePath = `${folder}/${params.name}`;
    if (!fs.existsSync(filePath)) { set.status = 404; set.headers["Content-Type"] = "text/html"; return notFoundHtml; }

    set.headers["Content-Type"] = `image/${filePath.split(".").pop()}`;

    if (imagesCache[filePath]) return imagesCache[filePath];

    imagesCache[filePath] = fs.readFileSync(filePath);
    return imagesCache[filePath];
});

router.get("/rss.xml", ({ set }) => {
    set.headers["Content-Type"] = "application/xml";
    return articlesToRss(blogPosts);
});

router.get("/*", ({ set }) => {
    set.status = 404;
    set.headers["Content-Type"] = "text/html";
    return notFoundHtml;
});

router.listen({
    hostname: Bun.env.HOSTNAME ?? "127.0.0.1",
    port: Bun.env.PORT ?? 3000,
});