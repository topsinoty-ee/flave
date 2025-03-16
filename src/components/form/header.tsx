import { SectionHeader, SectionHeaderProps } from "../section-header";

export default function FormHeader({ title, description }: SectionHeaderProps) {
  return <SectionHeader title={title} description={description} />;
}
