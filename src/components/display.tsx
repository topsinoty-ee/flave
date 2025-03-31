import { ComponentType, ReactNode } from "react";
import { SectionHeader, SectionHeaderProps } from "./section-header";
import clsx from "clsx";
import { isResource } from "@/types";
import { ErrorBoundary } from "react-error-boundary";

export type DisplayResourceProps<Resource extends object> = {
  Component: ComponentType<Resource>;
  data?: Resource | Resource[];
  className?: string;
  itemClassName?: string;
  after?: ReactNode;
  emptyState?: ReactNode;
  emptyStateClassName?: string;
} & Partial<SectionHeaderProps>;

const DefaultEmptyState = ({ className }: { className?: string }) => (
  <div className={clsx("text-center py-10 text-gray-500", className)}>
    No data available
  </div>
);

export const DisplayResource = <Resource extends object>(
  props: DisplayResourceProps<Resource>
) => {
  const {
    Component,
    data,
    className,
    itemClassName,
    after,
    emptyState,
    emptyStateClassName,
    ...headerProps
  } = props satisfies DisplayResourceProps<Resource>;

  const isEmptyArray = Array.isArray(data) && data.length === 0;
  const isEmpty = !data || isEmptyArray;

  const renderContent = () => {
    if (isEmpty) {
      return emptyState ? (
        emptyState
      ) : (
        <DefaultEmptyState className={emptyStateClassName} />
      );
    }

    if (Array.isArray(data)) {
      return (
        <div className="grid grid-cols-4 gap-10">
          {data.map((item, index) => (
            <Component
              {...item}
              key={isResource(item) ? item._id : index}
              className={itemClassName}
            />
          ))}
        </div>
      );
    }

    return <Component {...data} className={itemClassName} />;
  };

  const content = renderContent();

  return (
    <ErrorBoundary
      fallback={
        <section
          className={clsx(
            "flex flex-col gap-10 p-20 transition-all",
            className
          )}
        >
          {content}
        </section>
      }
    >
      <section
        className={clsx("flex flex-col gap-10 p-20 transition-all", className)}
      >
        {headerProps.title && (
          <SectionHeader title={headerProps.title} {...headerProps} />
        )}
        {content}
        {after}
      </section>
    </ErrorBoundary>
  );
};
