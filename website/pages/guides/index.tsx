import type { NextPage, GetStaticProps } from "next";
import { BasePage } from "../../components/base";
import { Hero } from "../../components/hero";
import { content } from "../../utils";
import * as path from "path";
import * as fs from "fs";
import Link from "next/link";

interface Guide {
    name: string;
    description: string;
    link: string;
}

interface GuidesProps {
    guides: Guide[];
}

const Guides: NextPage<content.PageContent<GuidesProps>> = ({ data }) => {
    const renderItem = (item: Guide, i: number) => {
        return(
            <div key={i} className="w-full lg:w-1/3 p-2">
                <div className="bg-slate-800 p-3">
                    <h3>
                        <Link href={item.link}>
                            <a className="hover:underline">{item.name}</a>
                        </Link>
                    </h3>
                    <p>{item.description}</p>
                </div>
            </div>
        );
    };

    const renderEmpty = () => {
        return(
            <div>
                How to guides coming soon.
            </div>
        );
    };

    return(
        <BasePage title={data.title} description={data.description}>
            <Hero name="How To Guides" />

            <div className="container mx-auto">
                <div className="flex flex-wrap">
                    { data.guides?.length > 0 ? data.guides.map(renderItem) : renderEmpty() }
                </div>
            </div>
        </BasePage>
    );
};

export const getStaticProps: GetStaticProps<content.PageContent<GuidesProps>> = () => {
    const docPath = path.join(process.cwd(), "content", "guides", "index.md");
    const page = content.readContentFile<GuidesProps>(docPath);

    const contentPath = path.join(process.cwd(), "content", "guides");
    const guides = fs.readdirSync(contentPath).filter(d => d !== "index.md");
    page.data.guides = guides.map(g => {
        const name = g.split(".")[0];
        return {
            name,
            link: `/guides/${name}`,
            description: "some description",
        };
    });

    return {
        props: {
            data: page.data,
            markdown: page.markdown,
        },
    };
};

export default Guides;
