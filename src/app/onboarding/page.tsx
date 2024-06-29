"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "@/components/custom/CustomButtons";
import { base, defiLogo } from "../../../public/assets";
import styles from "./TestimonyCarousel.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Header = () => {
    return (
        <div className="w-full absolute top-0 z-10 bg-transparent">
            <div className="max-w-[1380px] w-full md:w-[94%] mx-auto h-[70px] placeholder:h-[70px] flex justify-between items-center gap-3 py-10 px-[20px]">
                <div className="flex items-center font-bold text-sm md:text-xl h-[5rem]">
                    <div className="flex items-center gap-3 w-full justify-center">
                        <Image src={defiLogo} alt="Logo" className="w-12 shadow-sm shadow-white rounded-2xl" />
                        <span className="block sm:hidden lg:block text-2xl text-gray-700 font-bold">Social Tip</span>
                    </div>
                </div>
                <div className="relative text-xs md:text-base font-semibold flex items-center gap-3">
                    {/* <Link href="/sign-up">
                        <button className="bg-B0 hover:bg-B10 text-white font-bold py-2 px-6 rounded-lg hover:scale-105 transition-all shadow-md hover:shadow-2xl">
                            Signup
                        </button>
                    </Link> */}
                    <Link href="/login">
                        <button className="bg-B0 hover:bg-B10 text-white font-bold py-2 px-6 rounded-lg hover:scale-105 transition-all shadow-md hover:shadow-2xl">
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Hero = () => {
    return (
        <section className="bg-white flex flex-col justify-start items-center text-center gap-4 lg:gap-6 xl:gap-10 text-primary-1000 p-8 sm:p-10 lg:p-12 pt-32 sm:pt-40 md:pt-40 lg:pt-44 2xl:pt-48 sm:h-screen">
            <div className="bg-transparent max-w-[1380px] w-full md:w-[94%] h-full flex flex-col lg:flex-row justify-start lg:justify-center items-center text-center gap-8 lg:gap-10 text-primary-1000">
                {/* Left Content */}
                <div className="flex-1 h-full flex flex-col justify-center items-center lg:items-start gap-3 lg:gap-5">
                    {/* Heading and Description */}
                    <h1 className="text-center lg:text-start text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-bold text-primary-800 leading-[1.2]">
                        <span className="DM_Mono">Empowering Decentralized Social Interaction</span>
                    </h1>
                    <h6 className="w-3/4 lg:w-full text-center lg:text-start text-primary-850 text-base md:text-lg lg:text-2xl sm:leading-8">
                        Empower web3 builders with your tips and support their groundbreaking contributions seamlessly
                        on our platform.
                    </h6>
                </div>
                {/* hero image in right */}
                <div className="flex-1 h-full">
                    <img
                        src="https://cdn3d.iconscout.com/3d/premium/thumb/social-media-3654542-3049731.png?f=webp"
                        className="h-96"
                    />
                </div>
            </div>

            {/* Launch App Button */}
            <div className="text-center lg:text-start text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold">
                <div className="hidden lg:block transition-all text-xs md:text-base font-semibold hover:scale-105 rounded-full">
                    <Link href="/login">
                        <button className="bg-B0 hover:bg-B10 text-white font-bold py-2 px-6 rounded-lg hover:scale-105 transition-all shadow-md hover:shadow-2xl">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

const SliderComponent = () => {
    const settings = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        speed: 3000,
        autoplaySpeed: 3000,
        cssEase: "linear",
    };

    return (
        <div className="overflow-hidden h-[3rem]">
            <Slider {...settings}>
                <div className="h-10 max-w-52 border">1</div>
                <div className="h-10 max-w-52 border">2</div>
                <div className="h-10 max-w-52 border">3</div>
                <div className="h-10 max-w-52 border">4</div>
                <div className="h-10 max-w-52 border">5</div>
            </Slider>
        </div>
    );
};

const TestimonyCarousel = ({ slides }: any) => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
    };

    return (
        <div className={styles.carouselContainer}>
            <Slider {...settings}>
                {slides.map((item: any, index: number) => (
                    <div key={index}>
                        <div className="flex flex-col items-center justify-center">
                            {/* top  */}
                            <div className="">
                                <h2 className="text-center text-2xl font-semibold italic ">{item.title}</h2>
                                <p className="text-center text-lg">{item.desc}</p>
                            </div>

                            {/* btm  */}
                            <div className="h-96 w-96">
                                <img src={item.image1} alt={`${item.name}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

const page = () => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: "linear",
    };
    return (
        <>
            <Header />
            <Hero />
            {/* <div className="border border-red-400">
                <SliderComponent />
            </div> */}
            {/* 
            <div className="h-screen bg-W20 flex items-center justify-center border-4 border-green-800 p-10">
                <div className="w-1/2 border border-green-500 p-10">
                    <h1 className="text-6xl font-bold mb-4 DM_Mono">Welcome to Defilens</h1>
                    <p className="text-2xl mb-6">
                        Empower web3 builders with your tips and support their groundbreaking contributions seamlessly
                        on our platform.
                    </p>
                    <button className="bg-B0 hover:bg-B10 text-white font-bold py-3 px-6 rounded-lg">
                        Get Started
                    </button>
                </div>
                <div className="w-1/2 border border-green-500 p-10 flex flex-col items-center justify-center flex-[50%]">
                    <TestimonyCarousel slides={slides} />
                </div>
            </div> */}
        </>
    );
};

export default page;

const slides = [
    {
        image1: "https://cdn3d.iconscout.com/3d/premium/thumb/social-media-3654542-3049731.png?f=webp",
        title: "Team Up",
        desc: "Form a team with like minded people",
    },
    {
        image1: "https://cdn3d.iconscout.com/3d/premium/thumb/like-and-share-and-comment-5982102-4946517.png?f=webp",
        title: "Build",
        desc: "Discuss and build a project",
    },
    {
        image1: "Deposite Usdc",
        title: "Showcase",
        desc: "Share your project-centric portfolio",
    },
];

const data = [
    {
        image: base,
    },
];
