import React from "react";

interface HeroProps {
    name: string;
}

export const Hero: React.FC<HeroProps> = ({ name }) => {
    return(
        <div className="container mx-auto mt-6">
            <div className="w-full flex justify-center items-start hero">
                <div className="w-full mb-8 max-w-3xl mx-auto text-center">
                    <h1 className="my-3">
                        { name }
                    </h1>
                </div>
            </div>
        </div>
    );
};
