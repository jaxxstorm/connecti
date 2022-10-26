import type { NextPage } from "next";
import { BasePage } from "../../components/base";
import { Hero } from "../../components/hero";

const HowItWorks: NextPage = () => {
    return(
        <BasePage title="How It Works" description="">
            <Hero name="How it works" />
            <div className="container mx-auto my-16">
                <p>Coming soon...</p>
            </div>
        </BasePage>
    );
};

export default HowItWorks;
