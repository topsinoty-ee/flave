import { SectionHeader } from "@/components";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const QuickLink: React.FC<{
  name: string;
  endpoint: string;
  details: { count: number; quantifier: string };
}> = ({ name, details, endpoint }) => (
  <div className="bg-black h-full w-full flex flex-col justify-between rounded-lg p-10">
    <SectionHeader title={name} />
    <div className="flex justify-between items-center">
      <span className="font-thin italic text-lg">
        {`${details.count} ${details.quantifier}${details.count !== 1 ? "s" : ""}.`}
      </span>
      <Link href={endpoint}>
        <ExternalLink className="stroke-2" size={16} />
      </Link>
    </div>
  </div>
);
