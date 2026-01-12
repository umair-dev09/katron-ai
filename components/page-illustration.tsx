import Image from "next/image";

import Stripes from "@/public/images/stripes.svg";

export default function PageIllustration() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Stripes illustration */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 transform"
      >
        <Image
          className="max-w-none"
          src={Stripes}
          width={768}
          alt="Stripes"
          priority
        />
      </div>
      {/* Circles */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2"
        style={{ marginLeft: '580px' }}
      >
        <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-primary opacity-50 blur-[160px]" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[420px] -translate-x-1/2"
        style={{ marginLeft: '380px' }}
      >
        <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-primary to-gray-200 dark:to-gray-200 opacity-50 blur-[160px]" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[640px] -translate-x-1/2"
        style={{ marginLeft: '-300px' }}
      >
        <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-primary to-gray-200 dark:to-gray-200 opacity-50 blur-[160px]" />
      </div>
    </div>
  );
}
