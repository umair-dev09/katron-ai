import Image from "next/image";
import TestimonialImg from "@/public/images/large-testimonial.jpg";

export default function LargeTestimonial() {
  return (
    <section>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 -mt-20 md:-mt-28">
        <div className="py-12 md:py-20">
          <div className="space-y-3 text-center">
            <div className="relative inline-flex">
              <svg
                className="absolute -left-6 -top-2 -z-10"
                width={40}
                height={49}
                viewBox="0 0 40 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.7976 -0.000136375L39.9352 23.4746L33.4178 31.7234L13.7686 11.4275L22.7976 -0.000136375ZM9.34947 17.0206L26.4871 40.4953L19.9697 48.7441L0.320491 28.4482L9.34947 17.0206Z"
                  fill="currentColor"
                  className="text-muted"
                />
              </svg>
              <Image
                className="rounded-full"
                src={TestimonialImg}
                width={48}
                height={48}
                alt="Large testimonial"
              />
            </div>
            <p className="text-2xl font-bold text-foreground">
              "This platform has made gift-giving so much easier! The instant delivery and{" "}
              <em className="italic text-muted-foreground">wide selection of brands</em>{" "}
              make it my go-to choice every time."
            </p>
            <div className="text-sm font-medium text-muted-foreground">
              <span className="text-foreground">Sarah Johnson</span>{" "}
              <span className="text-border">/</span>{" "}
              <a className="text-primary hover:underline" href="#0">
                Frequent Buyer
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
