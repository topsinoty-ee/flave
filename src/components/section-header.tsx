import clsx from "clsx";

export interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  descriptionClassName?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  description,
  className,
  headerClassName,
  descriptionClassName,
}) => (
  <div className={clsx("flex flex-col gap-1", className)}>
    <div className="flex w-full gap-2.5 items-baseline">
      <div className="flex gap-2.5 items-center">
        {icon}
        <h2 className={clsx("uppercase w-max text-nowrap", headerClassName)}>
          {title}
        </h2>
      </div>
      <span className="w-full border-b-4 select-none border-yellow" />
    </div>
    <p className={clsx("font-medium text-sm text-gray", descriptionClassName)}>
      {description}
    </p>
  </div>
);
