import React, { forwardRef } from "react";
import clsx from "clsx";

export const ContainerOuter = forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(function OuterContainer({ className, children, ...props }, ref) {
  return (
    <div ref={ref} className={clsx("sm:px-2", className)} {...props}>
      <div className="mx-auto w-full max-w-7xl ">{children}</div>
    </div>
  );
});

export const ContainerInner = forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(function InnerContainer({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={clsx("relative px-2 sm:px-4 lg:px-6", className)}
      {...props}
    >
      <div className="mx-auto">{children}</div>
    </div>
  );
});

export const Container = forwardRef<
  React.ElementRef<typeof ContainerOuter>,
  React.ComponentPropsWithoutRef<typeof ContainerOuter>
>(function Container({ children, ...props }, ref) {
  return (
    <ContainerOuter ref={ref} {...props}>
      <ContainerInner>{children}</ContainerInner>
    </ContainerOuter>
  );
});
