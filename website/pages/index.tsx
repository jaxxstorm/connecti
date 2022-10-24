import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { BasePage } from "../components/base";

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
        <BasePage>
            <div className="container mx-auto mt-6">
                <div className="w-full flex justify-center items-start">
                    <div className="w-full text-center mb-8">
                        <h1 className="my-3">
                            connecti
                        </h1>
                        <p className="text-xl">
                            Quickly connect to any subnet using Tailscale.
                        </p>
                        <div className="mt-8">
                            <a href="#" className="rounded bg-gray-700 px-6 py-3 text-white font-bold hover:bg-gray-600">Install</a>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-2/3 mx-auto flex justify-center items-center">
                    <div className="bg-gray-800 px-4 rounded w-full h-full flex justify-center items-center">
                        <div id="hero-video" className="w-full h-full"></div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto my-24">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-1/2 pr-12">
                        <h2 className="mb-6">Quickly connect to any subnet</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ullamcorper blandit porttitor.
                            Aenean erat neque, facilisis et fringilla consequat, interdum vitae lacus. Praesent
                            tempor orci at orci gravida, et viverra purus iaculis. Cras tincidunt sapien tellus, at
                            dictum arcu pretium at. Aenean ante nisl.
                        </p>
                    </div>
                    <div className="w-full lg:w-1/2 pl-12">
                        <div className="bg-gray-800 p-6 rounded w-full h-full flex justify-center items-center">
                            visual
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto my-24">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-1/2 pr-12">
                        <div className="bg-gray-800 p-6 rounded w-full h-full flex justify-center items-center">
                            visual
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 pl-12">
                        <h2 className="mb-6">Manage connections</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ullamcorper blandit porttitor.
                            Aenean erat neque, facilisis et fringilla consequat, interdum vitae lacus. Praesent
                            tempor orci at orci gravida, et viverra purus iaculis. Cras tincidunt sapien tellus, at
                            dictum arcu pretium at. Aenean ante nisl.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto my-24">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-1/2 pr-12">
                        <h2 className="mb-6">Pulumi Service integration</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ullamcorper blandit porttitor.
                            Aenean erat neque, facilisis et fringilla consequat, interdum vitae lacus. Praesent
                            tempor orci at orci gravida, et viverra purus iaculis. Cras tincidunt sapien tellus, at
                            dictum arcu pretium at. Aenean ante nisl.
                        </p>
                    </div>
                    <div className="w-full lg:w-1/2 pl-12">
                        <div className="bg-gray-800 p-6 rounded w-full h-full flex justify-center items-center">
                            visual
                        </div>
                    </div>
                </div>
            </div>

            <div id="install" className="container mx-auto text-center my-24">
                <h2>Install</h2>

                <div className="flex flex-wrap justify-center items-center">
                    <div className="w-full lg:w-1/2 p-6">
                        <div className="bg-gray-800 p-6 rounded w-full h-full text-left">
                            <h3>Mac</h3>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 p-6">
                    <div className="bg-gray-800 p-6 rounded w-full h-full text-left">
                            <h3>Windows</h3>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 p-6">
                    <div className="bg-gray-800 p-6 rounded w-full h-full text-left">
                            <h3>Linux</h3>
                        </div>
                    </div>
                </div>
            </div>
        </BasePage>
    )
}

export default Home
