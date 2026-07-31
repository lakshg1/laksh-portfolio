declare module 'vanta/dist/vanta.fog.min' {
  export interface VantaEffect {
    destroy(): void;
    setOptions(options: Record<string, unknown>): void;
  }
  export default function FOG(options: Record<string, unknown>): VantaEffect;
}
