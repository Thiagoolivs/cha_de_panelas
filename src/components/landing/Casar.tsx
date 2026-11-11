import Image from "next/image";
import assets from "@/generated/assets.json";
import { copy } from "@/content/copy";
import { Rings } from "@/components/ornaments/Rings";

export function Casar() {
  return (
    <section aria-labelledby="casar-title" className="px-4 py-14">
      <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h2 id="casar-title" className="script text-[3.6rem] text-olive-700">
            {copy.casar.title}
          </h2>
          {copy.casar.body.map((p) => (
            <p key={p} className="mt-4 max-w-prose text-ink/90">
              {p}
            </p>
          ))}
        </div>
        <div className="order-1 md:order-2">
          {assets.hands ? (
            <Image
              src={assets.hands}
              alt={copy.casar.photoAlt}
              width={900}
              height={900}
              sizes="(min-width: 768px) 420px, 92vw"
              className="mx-auto aspect-[4/5] w-full max-w-[420px] object-cover"
            />
          ) : (
            <div className="mx-auto flex aspect-[4/5] w-full max-w-[360px] items-center justify-center bg-olive-900 p-10 outline outline-1 -outline-offset-8 outline-gold/40">
              <Rings className="w-full max-w-[220px]" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
