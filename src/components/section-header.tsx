export interface SectionHeaderProps {
  title: string;
  description?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex w-full gap-2.5 items-baseline">
      <h2 className="uppercase w-max text-nowrap">{title}</h2>
      <span className="w-full border-b-4 select-none border-yellow" />
    </div>
    <p className="font-medium text-sm text-gray">{description}</p>
  </div>
);
