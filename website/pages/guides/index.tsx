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
            <div key={i} className="w-full lg:w-1/3 p-6">
                <Link href={item.link}>
                    <div className="clickable-card flex-col text-black">
                        <h3 className="mb-3">
                            <a className="underline">{item.name}</a>
                        </h3>
                        <p>{item.description}</p>
                    </div>
                </Link>
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
                <p className="text-xl my-8 max-w-2xl mx-auto text-center">A collection of guides on how to connect to subnets and resources in different clouds.</p>
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
        const page = content.readContentFile(path.join(contentPath, g));

        const name = g.split(".")[0];
        return {
            name: page.data.title,
            link: `/guides/${name}`,
            description: page.data.description,
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
