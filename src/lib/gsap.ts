import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, Flip, SplitText);

export { Flip, gsap, SplitText, useGSAP };
