import type { ReactNode, Ref } from "react";

/**
 * Un paso del wizard: fieldset con su título ("01 — Sobre ti"). Los pasos inactivos quedan ocultos
 * pero dentro del mismo <form>, así que sus campos se envían igual. El título recibe el foco al llegar.
 */
export function QuoteStep({
  index,
  title,
  active,
  headingRef,
  children,
}: {
  index: number;
  title: string;
  active: boolean;
  headingRef?: Ref<HTMLHeadingElement>;
  children: ReactNode;
}) {
  return (
    <fieldset className="wizard__step" hidden={!active}>
      <legend>
        <h4 ref={active ? headingRef : undefined} tabIndex={-1}>
          {String(index + 1).padStart(2, "0")} — {title}
        </h4>
      </legend>
      {children}
    </fieldset>
  );
}
