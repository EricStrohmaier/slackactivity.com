import { Container } from "@/components/landingpage/container";
import HeroCTA from "./herocta";
import { landingpageContent } from "@/constants/landingpage";
import Image from "next/image";
import { renderSchemaTags } from "@/lib/seo";

export function Hero({ isMarketplace = false }) {
  const content = landingpageContent;

  return (
    <>
      {renderSchemaTags()}
      <div className="relative overflow-hidden h-full flex flex-col justify-between">
        <Container className="relative flex flex-col justify-center items-center text-center min-h-[500px] h-full">
          <h1 className="mx-auto md:max-w-8xl w-full text-5xl md:text-8xl max-md:leading-10 font-medium tracking-tight text-text">
            {content.hero.headline}
            <div className="relative whitespace-nowrap text-accent-400">
              <span className=" relative">{content.hero.highlightedText}</span>
            </div>{" "}
            {content.hero.suffix}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg tracking-tight text-gray-600">
            {content.hero.subheadline}
          </p>
          <div className="mt-2 flex justify-center gap-x-6">
            <HeroCTA content={content} />
          </div>
          {content.hero.socialCare.active && (
            <div className="flex gap-5 justify-center items-center mt-12 text-base md:text-xl text-black max-md:flex-wrap max-md:mt-10">
              <Image
                loading="lazy"
                src={content.hero.socialCare.image}
                alt={content.hero.socialCare.text}
                className="shrink-0 md:w-[172px] w-[100px] max-md:w-[80px] aspect-[2.94]"
              />
              <p className="my-auto text-gray-600">
                <span className="font-medium">
                  {content.hero.socialCare.fatPrefix}
                </span>{" "}
                {content.hero.socialCare.text}
              </p>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
