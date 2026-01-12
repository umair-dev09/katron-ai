import Image from "next/image";
import PlanetImg from "@/public/images/planet.png";
import PlanetOverlayImg from "@/public/images/planet-overlay.svg";
import PlanetTagImg01 from "@/public/images/planet-tag-01.png";
import PlanetTagImg02 from "@/public/images/planet-tag-02.png";
import PlanetTagImg03 from "@/public/images/planet-tag-03.png";
import PlanetTagImg04 from "@/public/images/planet-tag-04.png";

export default function FeaturesPlanet() {
  return (
    <section className="relative before:absolute before:inset-0 before:-z-20 before:bg-gray-900 dark:before:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-16 text-center md:pb-20">
            <h2 className="text-3xl font-bold text-gray-200 md:text-4xl">
              Your trusted platform for digital gift cards
            </h2>
          </div>
          {/* Planet */}
          <div className="pb-16 md:pb-20" data-aos="zoom-y-out">
            <div className="text-center">
              <div className="relative inline-flex rounded-full before:absolute before:inset-0 before:-z-10 before:scale-[.85] before:animate-[pulse_4s_cubic-bezier(.4,0,.6,1)_infinite] before:bg-gradient-to-b before:from-blue-500 before:to-blue-400/70 before:blur-3xl after:absolute after:inset-0 after:rounded-[inherit] after:[background:radial-gradient(closest-side,theme(colors.blue.400),transparent)]">
                <Image
                  className="rounded-full bg-gray-900 w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px]"
                  src={PlanetImg}
                  width={400}
                  height={400}
                  alt="Planet"
                />
                <div className="pointer-events-none hidden md:block" aria-hidden="true">
                  <Image
                    className="absolute -right-64 -top-20 z-10 max-w-none"
                    src={PlanetOverlayImg}
                    width={789}
                    height={755}
                    alt="Planet decoration"
                  />
                  <div>
                    <Image
                      className="absolute -left-28 top-16 z-10 opacity-80 transition-opacity duration-500"
                      src={PlanetTagImg01}
                      width={253}
                      height={56}
                      alt="Tag 01"
                    />
                    <Image
                      className="absolute left-56 top-7 z-10 opacity-30 transition-opacity duration-500"
                      src={PlanetTagImg02}
                      width={241}
                      height={56}
                      alt="Tag 02"
                    />
                    <Image
                      className="absolute -left-20 bottom-24 z-10 opacity-25 transition-opacity duration-500"
                      src={PlanetTagImg03}
                      width={243}
                      height={56}
                      alt="Tag 03"
                    />
                    <Image
                      className="absolute bottom-32 left-64 z-10 opacity-80 transition-opacity duration-500"
                      src={PlanetTagImg04}
                      width={251}
                      height={56}
                      alt="Tag 04"
                    />
                  </div>
                </div>
                {/* Mobile center tag */}
                <div className="pointer-events-none block md:hidden" aria-hidden="true">
                  <Image
                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-90"
                    src={PlanetTagImg01}
                    width={180}
                    height={40}
                    alt="Tag"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Grid */}
          <div className="grid overflow-hidden sm:grid-cols-2 lg:grid-cols-3 [&>*]:relative [&>*]:p-6 [&>*]:before:absolute [&>*]:before:bg-gray-800 [&>*]:before:h-[100vh] [&>*]:before:w-px [&>*]:before:top-0 [&>*]:before:-left-px [&>*]:after:absolute [&>*]:after:bg-gray-800 [&>*]:after:h-px [&>*]:after:w-[100vw] [&>*]:after:-top-px [&>*]:after:left-0 md:[&>*]:p-10">
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="fill-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z" />
                </svg>
                <span>Instant Delivery</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Receive your gift cards instantly via email. No waiting, no hassle. Start using them within seconds of purchase.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="fill-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M14.29 2.614a1 1 0 0 0-1.58-1.228L6.407 9.492l-3.199-3.2a1 1 0 1 0-1.414 1.415l4 4a1 1 0 0 0 1.496-.093l7-9ZM1 14a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2H1Z" />
                </svg>
                <span>Verified Brands</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Shop from thousands of verified brands and retailers. All gift cards are authentic and ready to use.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="fill-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path
                    d="M2.248 6.285a1 1 0 0 1-1.916-.57A8.014 8.014 0 0 1 5.715.332a1 1 0 0 1 .57 1.916 6.014 6.014 0 0 0-4.037 4.037Z"
                    opacity=".3"
                  />
                  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm1.715-6.752a1 1 0 0 1 .57-1.916 8.014 8.014 0 0 1 5.383 5.383 1 1 0 1 1-1.916.57 6.014 6.014 0 0 0-4.037-4.037Zm4.037 7.467a1 1 0 1 1 1.916.57 8.014 8.014 0 0 1-5.383 5.383 1 1 0 1 1-.57-1.916 6.014 6.014 0 0 0 4.037-4.037Zm-7.467 4.037a1 1 0 1 1-.57 1.916 8.014 8.014 0 0 1-5.383-5.383 1 1 0 1 1 1.916-.57 6.014 6.014 0 0 0 4.037 4.037Z" />
                </svg>
                <span>Secure & Safe</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Bank-level encryption and secure payment processing ensure your transactions are protected at all times.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="fill-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M8 0a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1Zm6 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1a1 1 0 1 1 0 2h-1a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h1a1 1 0 1 1 0 2h-1ZM1 1a1 1 0 0 0 0 2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 1 0 0 2h1a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H1Z" />
                </svg>
                <span>Easy Redemption</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Simple redemption process for all gift cards. Follow easy instructions and start enjoying your purchases.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="fill-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M10.284.33a1 1 0 1 0-.574 1.917 6.049 6.049 0 0 1 2.417 1.395A1 1 0 0 0 13.5 2.188 8.034 8.034 0 0 0 10.284.33ZM6.288 2.248A1 1 0 0 0 5.718.33 8.036 8.036 0 0 0 2.5 2.187a1 1 0 0 0 1.372 1.455 6.036 6.036 0 0 1 2.415-1.395ZM1.42 5.401a1 1 0 0 1 .742 1.204 6.025 6.025 0 0 0 0 2.79 1 1 0 0 1-1.946.462 8.026 8.026 0 0 1 0-3.714A1 1 0 0 1 1.421 5.4Zm2.452 6.957A1 1 0 0 0 2.5 13.812a8.036 8.036 0 0 0 3.216 1.857 1 1 0 0 0 .574-1.916 6.044 6.044 0 0 1-2.417-1.395Zm9.668.04a1 1 0 0 1-.041 1.414 8.033 8.033 0 0 1-3.217 1.857 1 1 0 1 1-.571-1.917 6.035 6.035 0 0 0 2.415-1.395 1 1 0 0 1 1.414.042Zm2.242-6.255a1 1 0 1 0-1.946.462 6.03 6.03 0 0 1 0 2.79 1 1 0 1 0 1.946.462 8.022 8.022 0 0 0 0-3.714Z" />
                </svg>
                <span>24/7 Support</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Our dedicated support team is always ready to help you with any questions or issues, day or night.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="fill-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M9 1a1 1 0 1 0-2 0v6a1 1 0 0 0 2 0V1ZM4.572 3.08a1 1 0 0 0-1.144-1.64A7.987 7.987 0 0 0 0 8a8 8 0 0 0 16 0c0-2.72-1.36-5.117-3.428-6.56a1 1 0 1 0-1.144 1.64A5.987 5.987 0 0 1 14 8 6 6 0 1 1 2 8a5.987 5.987 0 0 1 2.572-4.92Z" />
                </svg>
                <span>Best Deals</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Get exclusive discounts on popular gift cards. Save more while gifting more to your loved ones.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
