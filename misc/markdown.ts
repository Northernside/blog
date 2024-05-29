export function mdToHtml(md: string): string {
    md = md.replace(/\r\n/g, "\n");

    return md
        // Heading
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
        .replace(/^##### (.+)$/gm, "<h5>$1</h5>")
        .replace(/^###### (.+)$/gm, "<h6>$1</h6>")

        // Text formatting
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/~~(.+?)~~/g, "<del>$1</del>")
        .replace(/__(.+?)__/g, "<u>$1</u>")

        // Code
        .replace(/```(.+?)\n(.+?)```/gs, "<pre><code>$2</code></pre>")
        .replace(/`(.+?)`/g, "<code>$1</code>")

        // Images and links
        .replace(/!\[(.+?)\]\((.+?)\)/g, "<div><img src=\"$2\" alt=\"$1\"></div>")
        .replace(/\[(.+?)\]\((.+?)\)/g, "<a href=\"$2\">$1</a>")

        // Quotes
        .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")

        // if one line is empty, it's a new paragraph
        .replace(/\n\n/g, "<p></p>")
}

export function mdToLiteHtml(md: string): string {
    md = md.replace(/\r\n/g, "\n");

    return md
        // Heading
        .replace(/^# (.+)$/gm, "<strong>$1</strong> ")
        .replace(/^## (.+)$/gm, "<strong>$1</strong> ")
        .replace(/^### (.+)$/gm, "<strong>$1</strong> ")
        .replace(/^#### (.+)$/gm, "<strong>$1</strong> ")
        .replace(/^##### (.+)$/gm, "<strong>$1</strong> ")
        .replace(/^###### (.+)$/gm, "<strong>$1</strong> ")

        // Text formatting
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/~~(.+?)~~/g, "$1")
        .replace(/__(.+?)__/g, "$1")

        // Code
        .replace(/```(.+?)\n(.+?)```/gs, "$2")
        .replace(/`(.+?)`/g, "$1")

        // Images and links
        .replace(/!\[(.+?)\]\((.+?)\)/g, " $1 ")
        .replace(/\[(.+?)\]\((.+?)\)/g, " $1 ")

        // Quotes
        .replace(/^> (.+)$/gm, "$1")

        .replace(/\n\n/g, "")
}