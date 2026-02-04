import { cn } from "@/lib/utils";

interface RibbonProps {
  text: string;
  className?: string;
  childClassName?: string;
}

export const Ribbon = ({ text, className, childClassName }: RibbonProps) => {
  return (
    <div
      id="ribbon-container"
      className={cn("before:bg-amber-500 after:bg-amber-500", className)}
    >
      <div
        className={cn(
          "relative z-30 flex items-center justify-center bg-amber-400 text-[11px] font-medium text-black",
          childClassName,
        )}
      >
        <span className="font-roboto-condensed -ml-4">{text}</span>

        <div className="absolute mx-4 h-6 w-2 animate-[rightInfinite_2s_linear_infinite] bg-white opacity-30 shadow-sm shadow-white" />
      </div>
    </div>
  );
};
