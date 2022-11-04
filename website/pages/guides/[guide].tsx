import type { NextPage, GetStaticProps, GetStaticPaths, GetStaticPropsContext } from "next";
import { BasePage } from "../../components/base";
import { Hero } from "../../components/hero";
import { content } from "../../utils";
import * as path from "path";
import ReactMarkdown from "react-markdown";
import * as fs from "fs";

interface Guide {

}

const Guide: NextPage<content.PageContent<Guide>> = ({ data, markdown }) => {
    return(
        <BasePage title={data.title} description={data.description}>
            <Hero name={data.title} />

            <div className="container mx-auto mb-16">
                <div className="px-3 lg:max-w-4xl mx-auto">
                    <div className="guide-markdown">
                        <ReactMarkdown>
                            { markdown }
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </BasePage>
    );
};

export const getStaticPaths: GetStaticPaths = () => {
    const contentPath = path.join(process.cwd(), "content", "guides");
    const guides = fs.readdirSync(contentPath).filter(d => d !== "index.md");
    const guidePaths = guides.map(g => `/guides/${g.split(".")[0]}`);

    return {
        paths: guidePaths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<content.PageContent<Guide>> = (ctx: GetStaticPropsContext) => {
    const guide = ctx.params?.guide as string;
    if (!guide) {
        throw Error(`guide not provided`);
    }

    const docPath = path.join(process.cwd(), "content", "guides", `${guide}.md`);
    const page = content.readContentFile<Guide>(docPath);

    let markdown = "";
    try {
        markdown = fs.readFileSync(path.join(process.cwd(), "..", "docs", guide, "README.md")).toString();
    } catch (e) {
        markdown = "Coming soon...";
    }

    return {
        props: {
            data: page.data,
            markdown,
        },
    };
};

export default Guide;
