import fs from "node:fs";
import type { EightyEightByThirtyOne } from "../types";

export function load88x31s(): EightyEightByThirtyOne[] {
    const folder = Bun.env.BANNER_DIR ?? "./88x31";
    return fs.readdirSync(folder).filter((file) => file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif"))
        .map((file) => {
            const filePath = `${folder}/${file}`;
            const domain = file.match(/^(.+)\./)?.[1] ?? file;
            
            return {
                name: domain,
                path: filePath
            }
        });
}

export function load88x31sHtml(): string {
    const folder = Bun.env.BANNER_DIR ?? "./88x31";
    const files = fs.readdirSync(folder).filter((file) => file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif"));
    return files.map((file) => {
        const domain = file.match(/^(.+)\./)?.[1];
        const filePath = `${folder}/${domain}`;

        return `<a href="https://${domain}"><img src="${filePath}" alt="${domain}'s 88x31"></a>`;
    }).join("");
}