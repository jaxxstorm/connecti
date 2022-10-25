import * as fs from "fs";
import yaml from "yaml";

export interface PageFrontMatter {
    title: string;
    description: string;
}

export interface PageContent<T> {
    data: PageFrontMatter & T;
    markdown: string;
}

export function readContentFile<T>(filePath: string): PageContent<T> {
    const fileContents = fs.readFileSync(filePath).toString();
    const fileParts = fileContents.split("---");
    const frontMatter = fileParts[1];
    const fileMarkdown = fileParts[2];

    const parsedFrontMatter: PageFrontMatter & T = yaml.parse(frontMatter);

    return {
        data: parsedFrontMatter,
        markdown: fileMarkdown,
    };
}
