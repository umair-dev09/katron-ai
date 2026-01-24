import Image from "next/image";
import PageIllustration from "@/components/page-illustration";
import Avatar01 from "@/public/images/avatar-01.jpg";
import Avatar02 from "@/public/images/avatar-02.jpg";
import Avatar03 from "@/public/images/avatar-03.jpg";
import Avatar04 from "@/public/images/avatar-04.jpg";
import Avatar05 from "@/public/images/avatar-05.jpg";
import Avatar06 from "@/public/images/avatar-06.jpg";
import Logo01 from "@/public/katron-ai-logo-bg-transparent.png";
import Logo02 from "@/public/logos/apple-logo.svg";
import Logo03 from "@/public/logos/ea-logo.svg";
import Logo04 from "@/public/logos/netflix-logo.svg";
import Logo05 from "@/public/logos/visa-logo.svg";
import Logo06 from "@/public/logos/spotify-logo.svg";
import Logo07 from "@/public/logos/starbucks-logo.svg";
import Logo08 from "@/public/logos/nike-logo.svg";
import Logo09 from "@/public/logos/amazon-logo.svg";
export default function HeroHome() {
  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-8 pt-24 md:pb-12 md:pt-32">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            <div
              className="mb-6 border-y [border-image:linear-gradient(to_right,transparent,theme(colors.border),transparent)1]"
              data-aos="zoom-y-out"
            >
              <div className="-mx-0.5 flex justify-center -space-x-3">
                <Image
                  className="box-content rounded-full border-2 border-gray-50 dark:border-gray-800"
                  src={Avatar01}
                  width={32}
                  height={32}
                  alt="Avatar 01"
                />
                <Image
                  className="box-content rounded-full border-2 border-gray-50 dark:border-gray-800"
                  src={Avatar02}
                  width={32}
                  height={32}
                  alt="Avatar 02"
                />
                <Image
                  className="box-content rounded-full border-2 border-gray-50 dark:border-gray-800"
                  src={Avatar03}
                  width={32}
                  height={32}
                  alt="Avatar 03"
                />
                <Image
                  className="box-content rounded-full border-2 border-gray-50 dark:border-gray-800"
                  src={Avatar04}
                  width={32}
                  height={32}
                  alt="Avatar 04"
                />
                <Image
                  className="box-content rounded-full border-2 border-gray-50 dark:border-gray-800"
                  src={Avatar05}
                  width={32}
                  height={32}
                  alt="Avatar 05"
                />
                <Image
                  className="box-content rounded-full border-2 border-gray-50 dark:border-gray-800"
                  src={Avatar06}
                  width={32}
                  height={32}
                  alt="Avatar 06"
                />
              </div>
            </div>
            <h1
              className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,theme(colors.border),transparent)1] md:text-6xl"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              The gift card marketplace <br className="max-lg:hidden" />
              you're looking for
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-muted-foreground"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Discover thousands of gift cards from top brands. Buy instantly, send digitally, and enjoy exclusive deals with our secure platform.
              </p>
              <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,theme(colors.border),transparent)1]">
                <div
                  className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <a
                    className="btn group mb-4 w-full bg-gradient-to-t from-primary/90 to-primary bg-[length:100%_100%] bg-[bottom] text-primary-foreground shadow-sm hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors h-10"
                    href="/buy"
                  >
                    <span className="relative inline-flex items-center">
                      Browse Gift Cards{" "}
                      <span className="ml-1 tracking-normal text-primary-foreground/80 transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </a>
                  <a
                    className="btn w-full bg-background border border-border text-foreground shadow-sm hover:bg-accent/10 sm:ml-4 sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors h-10"
                    href="/auth"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
       <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* Tab panels */}
          <div className="relative flex h-[200px] sm:h-[260px] md:h-[324px] items-center justify-center overflow-hidden" data-aos="zoom-y-out" data-aos-delay={600}>
            {/* Small blue dots */}
            <div className="absolute -z-10 hidden sm:block">
              <svg
                className="fill-primary"
                xmlns="http://www.w3.org/2000/svg"
                width={164}
                height={41}
                viewBox="0 0 164 41"
                fill="none"
              >
                <circle cx={1} cy={8} r={1} fillOpacity="0.24" />
                <circle cx={1} cy={1} r={1} fillOpacity="0.16" />
                <circle cx={1} cy={15} r={1} />
                <circle cx={1} cy={26} r={1} fillOpacity="0.64" />
                <circle cx={1} cy={33} r={1} fillOpacity="0.24" />
                <circle cx={8} cy={8} r={1} />
                <circle cx={8} cy={15} r={1} />
                <circle cx={8} cy={26} r={1} fillOpacity="0.24" />
                <circle cx={15} cy={15} r={1} fillOpacity="0.64" />
                <circle cx={15} cy={26} r={1} fillOpacity="0.16" />
                <circle cx={8} cy={33} r={1} />
                <circle cx={1} cy={40} r={1} />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 164 7)"
                  fillOpacity="0.24"
                />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 164 0)"
                  fillOpacity="0.16"
                />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 164 14)"
                />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 164 25)"
                  fillOpacity="0.64"
                />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 164 32)"
                  fillOpacity="0.24"
                />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 157 7)"
                />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 157 14)"
                />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 157 25)"
                  fillOpacity="0.24"
                />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 150 14)"
                  fillOpacity="0.64"
                />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 150 25)"
                  fillOpacity="0.16"
                />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 157 32)"
                />
                <circle
                  cx={1}
                  cy={1}
                  r={1}
                  transform="matrix(-1 0 0 1 164 39)"
                />
              </svg>
            </div>
            {/* Blue glow */}
            <div className="absolute -z-10 scale-50 sm:scale-75 md:scale-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={432}
                height={160}
                viewBox="0 0 432 160"
                fill="none"
              >
                <g opacity="0.6" filter="url(#filter0_f_2044_9)">
                  <path
                    className="fill-primary"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M80 112C62.3269 112 48 97.6731 48 80C48 62.3269 62.3269 48 80 48C97.6731 48 171 62.3269 171 80C171 97.6731 97.6731 112 80 112ZM352 112C369.673 112 384 97.6731 384 80C384 62.3269 369.673 48 352 48C334.327 48 261 62.3269 261 80C261 97.6731 334.327 112 352 112Z"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_f_2044_9"
                    x={0}
                    y={0}
                    width={432}
                    height={160}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation={32}
                      result="effect1_foregroundBlur_2044_9"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            {/* Horizontal lines */}
            <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent mix-blend-multiply dark:mix-blend-normal"></div>
            <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent mix-blend-multiply dark:mix-blend-normal"></div>
            <div className="absolute inset-x-[200px] top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mix-blend-multiply dark:mix-blend-normal"></div>
            <div className="absolute inset-x-0 top-1/2 -z-10 h-px -translate-y-[82px] bg-gradient-to-r from-transparent via-border to-transparent mix-blend-multiply dark:mix-blend-normal before:absolute before:inset-y-0 before:w-24 before:animate-[line_10s_ease-in-out_infinite_both] before:bg-gradient-to-r before:via-primary"></div>
            <div className="absolute inset-x-0 top-1/2 -z-10 h-px translate-y-[82px] bg-gradient-to-r from-transparent via-border to-transparent mix-blend-multiply dark:mix-blend-normal before:absolute before:inset-y-0 before:w-24 before:animate-[line_10s_ease-in-out_infinite_5s_both] before:bg-gradient-to-r before:via-primary"></div>
            {/* Diagonal lines */}
            <div className="absolute inset-x-[300px] top-1/2 -z-10 h-px rotate-[20deg] bg-gradient-to-r from-transparent via-border to-transparent mix-blend-multiply dark:mix-blend-normal"></div>
            <div className="absolute inset-x-[300px] top-1/2 -z-10 h-px -rotate-[20deg] bg-gradient-to-r from-transparent via-border to-transparent mix-blend-multiply dark:mix-blend-normal"></div>
            {/* Vertical lines */}
            <div className="absolute inset-y-0 left-1/2 -z-10 w-px -translate-x-[216px] bg-gradient-to-b from-border to-transparent mix-blend-multiply dark:mix-blend-normal"></div>
            <div className="absolute inset-y-0 left-1/2 -z-10 w-px translate-x-[216px] bg-gradient-to-t from-border to-transparent mix-blend-multiply dark:mix-blend-normal"></div>
            {/* Logos */}
            <div className="absolute before:absolute before:-inset-2 sm:before:-inset-3 before:animate-[spin_3s_linear_infinite] before:rounded-full before:border before:border-transparent before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] before:[background:conic-gradient(from_180deg,transparent,hsl(var(--primary)))_border-box]">
              <div>
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-background shadow-lg shadow-black/[0.03] before:absolute before:inset-0 before:m-[8.334%] before:rounded-[inherit] before:border before:border-border/20 before:bg-muted/60 before:[mask-image:linear-gradient(to_bottom,black,transparent)]">
                  <Image
                    className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-[46px] md:h-[46px]"
                    src={Logo01}
                    width={46}
                    height={46}
                    alt="Logo 01"
                  />
                </div>
              </div>
            </div>

            <div className="relative flex flex-col scale-[0.5] sm:scale-[0.7] md:scale-100">
              <article className="flex h-full w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2">
                <div className="absolute -translate-x-[136px]">
                  <div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-lg shadow-black/[0.03] before:absolute before:inset-0 before:m-[8.334%] before:rounded-[inherit] before:border before:border-border/20 before:bg-muted/60 before:[mask-image:linear-gradient(to_bottom,black,transparent)]">
                      <Image
                        className="relative"
                        src={Logo02}
                        width={23}
                        height={22}
                        alt="Logo 02"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute translate-x-[136px]">
                  <div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-lg shadow-black/[0.03] before:absolute before:inset-0 before:m-[8.334%] before:rounded-[inherit] before:border before:border-border/20 before:bg-muted/60 before:[mask-image:linear-gradient(to_bottom,black,transparent)]">
                      <Image
                        className="relative"
                        src={Logo03}
                        width={25}
                        height={25}
                        alt="Logo 03"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -translate-x-[216px] -translate-y-[82px]">
                  <div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-lg shadow-black/[0.03] before:absolute before:inset-0 before:m-[8.334%] before:rounded-[inherit] before:border before:border-border/20 before:bg-muted/60 before:[mask-image:linear-gradient(to_bottom,black,transparent)]">
                      <Image
                        className="relative"
                        src={Logo04}
                        width={26}
                        height={46}
                        alt="Logo 04"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -translate-y-[82px] translate-x-[216px]">
                  <div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-lg shadow-black/[0.03] before:absolute before:inset-0 before:m-[8.334%] before:rounded-[inherit] before:border before:border-border/20 before:bg-muted/60 before:[mask-image:linear-gradient(to_bottom,black,transparent)]">
                      <Image
                        className="relative"
                        src={Logo05}
                        width={38}
                        height={26}
                        alt="Logo 05"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute translate-x-[216px] translate-y-[82px]">
                  <div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-lg shadow-black/[0.03] before:absolute before:inset-0 before:m-[8.334%] before:rounded-[inherit] before:border before:border-border/20 before:bg-muted/60 before:[mask-image:linear-gradient(to_bottom,black,transparent)]">
                      <Image
                        className="relative"
                        src={Logo06}
                        width={26}
                        height={18}
                        alt="Logo 06"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -translate-x-[216px] translate-y-[82px]">
                  <div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-lg shadow-black/[0.03] before:absolute before:inset-0 before:m-[8.334%] before:rounded-[inherit] before:border before:border-border/20 before:bg-muted/60 before:[mask-image:linear-gradient(to_bottom,black,transparent)]">
                      <Image
                        className="relative"
                        src={Logo07}
                        width={28}
                        height={26}
                        alt="Logo 07"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -translate-x-[292px] opacity-40">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-background shadow-lg">
                      <Image
                        className="relative"
                        src={Logo08}
                        width={20}
                        height={20}
                        alt="Logo 08"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute translate-x-[292px] opacity-40">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-background shadow-lg">
                      <Image
                        className="relative"
                        src={Logo09}
                        width={21}
                        height={13}
                        alt="Logo 09"
                      />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </section>
  );
}