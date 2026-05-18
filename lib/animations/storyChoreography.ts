import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollState } from '@/lib/three/scrollState';

const DEG = Math.PI / 180;

const CHAPTER_POSES = [
  { rotY: 300, rim: 1.45, pulse: 0.6 },
  { rotY: 318, rim: 1.55, pulse: 0.7 },
  { rotY: 336, rim: 1.65, pulse: 0.8 },
];

export interface StoryChoreographyElements {
  story: HTMLElement;
}

export function createStoryChoreography(
  elements: StoryChoreographyElements,
  reducedMotion = false
) {
  const { story } = elements;
  if (reducedMotion) return () => {};

  const ctx = gsap.context(() => {
    const chapters = story.querySelectorAll('.story-chapter');
    const pills = story.querySelectorAll('.story-stat-pill');

    chapters.forEach((chapter, i) => {
      const pose = CHAPTER_POSES[i] ?? CHAPTER_POSES[0];

      ScrollTrigger.create({
        trigger: chapter,
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: () => applyPose(pose, i, pills),
        onEnterBack: () => applyPose(pose, i, pills),
      });
    });
  }, story);

  return () => ctx.revert();

  function applyPose(
    pose: (typeof CHAPTER_POSES)[0],
    index: number,
    pills: NodeListOf<Element>
  ) {
    gsap.to(scrollState.can, {
      rotY: pose.rotY * DEG,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    gsap.to(scrollState, {
      rimIntensity: pose.rim,
      energyPulse: pose.pulse,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(scrollState, { energyPulse: 0, duration: 0.5 });
      },
    });

    pills.forEach((p, j) => {
      p.classList.toggle('is-active', j === index);
    });
  }
}
