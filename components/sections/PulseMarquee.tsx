import Marquee from '@/components/ui/Marquee';

/** 02 PULSE — two crossing bands the can tears through. */
export default function PulseMarquee() {
  return (
    <section id="pulse" className="pulse relative h-[85svh] min-h-[480px] overflow-hidden" aria-label="Zolt highlights">
      <div className="pulse-band pulse-band--volt">
        <Marquee
          items={['Zero sugar', '150mg natural caffeine', 'Electrolyte loaded', 'No crash']}
          speed={2.4}
          direction={-1}
        />
      </div>
      <div className="pulse-band pulse-band--ink">
        <Marquee
          items={['Feel the voltage', 'Outrun the moment', 'One can. Full charge']}
          speed={1.8}
          direction={1}
          className="marquee--outline"
        />
      </div>
    </section>
  );
}
