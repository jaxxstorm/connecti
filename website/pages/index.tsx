import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { BasePage } from "../components/base";
import { Command } from "../components/command";
import { GetStarted } from "../components/get-started";

const Home: NextPage = () => {
    const [ videoLoaded, setVideoLoaded ] = useState(false);

    const appendVideo = () => {
        if (videoLoaded) {
            return;
        }

        const script = document.createElement("script");
        script.id = "asciicast-526613";
        script.src = "https://asciinema.org/a/526613.js";
        script.async = true;

        const element = document.getElementById("hero-video");
        element?.appendChild(script);
        setVideoLoaded(true);
    };

    useEffect(() => {
        appendVideo();
    }, []);

    return (
        <BasePage title="connecti" description="">
            <div className="container mx-auto mt-6">
                <div className="w-full flex justify-center items-start hero">
                    <div className="w-full text-center mb-8">
                        <h1 className="my-3">
                            connecti
                        </h1>
                        <p className="text-xl">
                            Quickly connect to any subnet.
                        </p>
                        <div className="mt-12">
                            <a href="#get-started" className="rounded bg-gray-700 px-6 py-3 text-white font-bold hover:bg-gray-600">Get Started</a>
                        </div>
                    </div>
                </div>

            </div>

            <div className="container mx-auto my-12">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-2/3 pl-12">
                        <div className="bg-gray-800 px-4 rounded w-full h-full flex justify-center items-center shadow-lg shadow-gray-700">
                            <div id="hero-video" className="w-full h-full"></div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3 pl-6">
                        <h2 className="mb-6">Connect to any subnet</h2>
                        <p className="mb-3 text-lg">
                            If you're provisioning cloud infrastructure correctly, you'll provision sensitive services
                            in private subnets. This means they're often not routable from your machine or your CI/CD
                            infrastructure.
                        </p>
                        <p className="text-lg">
                            connecti uses Pulumi's Automation API to create Tailscale API keys, store them in your cloud provider's
                            secret store, and then creates a small compute node for which to advertise routes for you.
                        </p>
                    </div>
                </div>
            </div>

            <div id="get-started">
                <GetStarted />
            </div>
        </BasePage>
    )
}

export default Home
