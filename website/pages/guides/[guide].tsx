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

            <div className="container mx-auto guide-markdown">
                <ReactMarkdown>
                    { markdown }
                </ReactMarkdown>
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

    return {
        props: {
            data: page.data,
            markdown: page.markdown,
        },
    };
};

export default Guide;
