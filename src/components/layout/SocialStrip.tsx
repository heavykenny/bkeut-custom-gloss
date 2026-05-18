import { Instagram, TikTok, SOCIAL_LINKS } from "./social-icons";

type Props = {
  visible?: boolean;
};

export function SocialStrip({ visible = true }: Props) {
  if (!visible) return null;
  return (
    <div className="hidden md:flex fixed right-2 top-1/2 -translate-y-1/2 z-20 flex-col gap-4 opacity-70 hover:opacity-100 transition-opacity">
      <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener" aria-label="Instagram">
        <Instagram className="size-5" />
      </a>
      <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener" aria-label="TikTok">
        <TikTok className="size-5" />
      </a>
    </div>
  );
}
