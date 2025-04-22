import clsx from "clsx";
import Image from "next/image";

export const Logo = ({
                         type = "light",
                         className,
                     }: {
    type: "dark" | "light";
    className?: string;
}) => (
    <div className="h-full logo max-h-20">
        <Image
            width={420}
            height={200}
            className={clsx("max-h-15", className)}
            priority
            quality={100}
            src={type === "light" ? "/logo/black.svg" : "/logo/white.svg"}
            alt="flave logo"
        />
    </div>
);
