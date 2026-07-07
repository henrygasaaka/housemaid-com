declare module "react-world-flags" {
  import type { ImgHTMLAttributes } from "react";

  type FlagProps = ImgHTMLAttributes<HTMLImageElement> & {
    code?: string;
    fallback?: React.ReactNode;
  };

  export default function Flag(props: FlagProps): JSX.Element;
}
