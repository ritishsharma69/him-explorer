import * as React from "react";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
	  const base = "mx-auto w-full max-w-6xl px-4";

	  return <div className={[base, className].filter(Boolean).join(" ")} {...props} />;
}

