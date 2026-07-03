"use client";

import { GoogleIcon } from "@/components/candidate/google-icon";

type OAuthButtonProps = {
  provider: "google" | "apple";
  primary?: boolean;
  onClick: () => void;
};

export function OAuthButton({ provider, primary, onClick }: OAuthButtonProps) {
  const isGoogle = provider === "google";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-2.5 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[13px] py-[13px] text-[14.5px] font-bold ${
        primary
          ? "border-none bg-blue text-white"
          : "border border-border bg-white text-ink"
      }`}
    >
      {isGoogle ? (
        <GoogleIcon variant={primary ? "white" : "color"} />
      ) : (
        <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden>
          <path
            d="M13.95 5.65c-.1.07-1.78 1.02-1.78 3.13 0 2.44 2.14 3.3 2.2 3.32-.01.06-.34 1.17-1.13 2.3-.7 1-1.43 1.99-2.55 1.99s-1.4-.65-2.69-.65c-1.25 0-1.7.67-2.72.67s-1.73-.92-2.55-2.05C1.74 12.97 1 11.13 1 9.4c0-2.85 1.85-4.36 3.67-4.36 1.05 0 1.92.69 2.58.69.63 0 1.6-.73 2.8-.73.45 0 2.07.04 3.14 1.5-.08.05-1.87 1.09-1.87 1.45zM9.4 3.74c-.5.59-1.33 1.04-2.13.97-.1-.78.27-1.6.73-2.12.5-.58 1.38-1.01 2.17-1.01.8 0 1.54.43 2.23 1.01z"
            fill={primary ? "#fff" : "#000"}
          />
        </svg>
      )}
      Continue with {isGoogle ? "Google" : "Apple"}
    </button>
  );
}
