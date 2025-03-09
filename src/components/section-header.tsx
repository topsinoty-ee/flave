export interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex w-full gap-2.5 items-baseline">
      <div className="flex gap-2.5 items-center">
        {icon}
        <h2 className="uppercase w-max text-nowrap">{title}</h2>
      </div>
      <span className="w-full border-b-4 select-none border-yellow" />
    </div>
    <p className="font-medium text-sm text-gray">{description}</p>
  </div>
);
