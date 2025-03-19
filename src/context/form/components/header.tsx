import { SectionHeader, SectionHeaderProps } from "@/components";

export const FormHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
}) => {
  return <SectionHeader title={title} description={description} />;
};
