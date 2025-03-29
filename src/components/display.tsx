import { ComponentType, ReactNode } from "react";
import { SectionHeader, SectionHeaderProps } from "./section-header";
import clsx from "clsx";
import { isResource } from "@/types";
import { ErrorBoundary } from "react-error-boundary";

export type DisplayResourceProps<Resource extends object> =
  Partial<SectionHeaderProps> & {
    Component: ComponentType<Resource>;
    data?: Resource | Resource[];
    className?: string;
    itemClassName?: string;
    fallback?: ReactNode;
    after?: ReactNode;
  };

export const DisplayResource = <Resource extends object>({
  Component,
  data,
  className,
  itemClassName,
  fallback,
  after,
  ...headerProps
}: DisplayResourceProps<Resource>) => (
  <ErrorBoundary
    fallback={
      <section
        className={clsx("flex flex-col gap-10 p-20 transition-all", className)}
      >
        {!data ? (
          <h3>No data added</h3>
        ) : Array.isArray(data) ? (
          <div className="grid grid-cols-4 gap-10">
            {data.map((item, index) => (
              <Component
                {...item}
                key={isResource(item) ? item._id : index}
                className={itemClassName}
              />
            ))}
          </div>
        ) : (
          <Component {...data} className={itemClassName} />
        )}
      </section>
    }
  >
    <section
      className={clsx("flex flex-col gap-10 p-20 transition-all", className)}
    >
      {headerProps.title && (
        <SectionHeader title={headerProps.title} {...headerProps} />
      )}
      {!data ? (
        <h3>No data added</h3>
      ) : Array.isArray(data) ? (
        <div className="grid grid-cols-4 gap-10">
          {data.map((item, index) => (
            <Component
              {...item}
              key={isResource(item) ? item._id : index}
              className={itemClassName}
            />
          ))}
        </div>
      ) : (
        <Component {...data} className={itemClassName} />
      )}
      {after}
    </section>
  </ErrorBoundary>
);
