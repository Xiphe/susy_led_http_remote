import { cn } from "@/utils";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export function PaletteInput() {
  const box = useRef<HTMLDivElement>(null);
  return (
    <>
      <div
        ref={box}
        className="grow border-4 border-muted border-b-0 m-4 mb-8 relative"
      >
        <DraggableColor boxRef={box} />
      </div>
    </>
  );
}

type DraggableColorProps = {
  boxRef: RefObject<HTMLDivElement>;
};
function DraggableColor({ boxRef }: DraggableColorProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragRef = useRef<((ev: PointerEvent) => void) | null>(null);
  const stop = useCallback(() => {
    setIsDragging(false);
    enableInteractions(document.querySelector("body"));

    window.removeEventListener("pointerup", stop);
    if (dragRef.current) {
      window.removeEventListener("pointermove", dragRef.current);
      dragRef.current = null;
    }
  }, []);

  return (
    <div
      onPointerDown={({ target }) => {
        if (!isHTMLDivElement(target) || !boxRef.current) {
          return;
        }

        disableInteractions(document.querySelector("body"));
        setIsDragging(true);

        dragRef.current = createDragHandler({
          $el: target,
          $box: boxRef.current,
        });
        window.addEventListener("pointerup", stop);
        window.addEventListener("pointermove", dragRef.current);
      }}
      style={{
        marginTop: "calc(-0.75rem - 2px)",
        marginLeft: "calc(-0.75rem - 2px)",
      }}
      className={cn(
        "bg-red-500 absolute rounded-full border-2 border-foreground w-6 h-6",
        "touch-none",
        isDragging && "outline outline-red-500"
      )}
    />
  );
}

function disableInteractions($el: HTMLElement | null) {
  if ($el) {
    $el.style.pointerEvents = "none";
    $el.style.userSelect = "none";
  }
}

function enableInteractions($el: HTMLElement | null) {
  if ($el) {
    $el.style.removeProperty("pointer-events");
    $el.style.removeProperty("user-select");
  }
}

type DragHandlerOpts = {
  $el: HTMLDivElement;
  $box: HTMLDivElement;
};
function createDragHandler({ $el, $box }: DragHandlerOpts) {
  return (ev: PointerEvent) => {
    const boxRect = $box.getBoundingClientRect();
    const width = boxRect.width - 4;
    const height = boxRect.height;
    const x = ev.clientX - boxRect.left - 3;
    const y = ev.clientY - boxRect.top - 3;

    const isFirstThird = x < width / 2;
    const isSecondThird = isFirstThird ? x > y : width - x > y;

    if (isSecondThird) {
      $el.style.top = "0px";
      $el.style.left = `${Math.min(width - 4, Math.max(x, 0))}px`;
    } else if (isFirstThird) {
      $el.style.left = `0px`;
      $el.style.top = `${Math.min(height - 4, Math.max(y, 0))}px`;
    } else {
      $el.style.left = `${width}px`;
      $el.style.top = `${Math.min(height - 4, Math.max(y, 0))}px`;
    }
  };
}

function isHTMLDivElement(target: EventTarget): target is HTMLDivElement {
  return (target as HTMLDivElement).nodeName === "DIV";
}
