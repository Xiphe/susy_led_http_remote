import { cn } from "@/utils";
import {
  CSSProperties,
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";

const STEPS = 255;

type PaletteInputProps = {
  p: "a" | "b";
};
export function PaletteInput({ p }: PaletteInputProps) {
  const box = useRef<HTMLDivElement | null>(null);
  const resizeObsRef = useRef<ResizeObserver | null>(null);
  const [width, setWidth] = useState<number>(-1);
  const [height, setHeight] = useState<number>(-1);

  return (
    <>
      <div
        ref={($el) => {
          if (resizeObsRef.current) {
            resizeObsRef.current.disconnect();
          }

          if ($el) {
            box.current = $el;
            resizeObsRef.current = new ResizeObserver(([{ contentRect }]) => {
              setWidth(contentRect.width);
              setHeight(contentRect.height);
            });
            resizeObsRef.current.observe($el);
          } else {
            box.current = null;
          }
        }}
        className="grow border-4 border-muted border-b-0 m-4 mb-8 relative"
      >
        <DraggableColor boxRef={box} boxHeight={height} boxWidth={width} />
      </div>
    </>
  );
}

type DraggableColorProps = {
  boxWidth: number;
  boxHeight: number;
  boxRef: RefObject<HTMLDivElement>;
};
function DraggableColor({ boxRef, boxHeight, boxWidth }: DraggableColorProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
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
      onPointerDown={() => {
        if (!boxRef.current) {
          return;
        }

        disableInteractions(document.querySelector("body"));
        setIsDragging(true);

        dragRef.current = createDragHandler({
          $box: boxRef.current,
          setValue,
        });
        window.addEventListener("pointerup", stop);
        window.addEventListener("pointermove", dragRef.current);
      }}
      style={{
        ...getDotPosition({ boxHeight, boxWidth, value }),
        marginTop: "calc(-0.75rem - 2px)",
        marginLeft: "calc(-0.75rem - 2px)",
      }}
      className={cn(
        "bg-red-500 absolute rounded-full border-2 border-foreground w-6 h-6",
        "touch-none"
      )}
    />
  );
}

type GetDotPositionOpts = {
  boxWidth: number;
  boxHeight: number;
  value: number;
};
function getDotPosition({
  value: byteVal,
  boxHeight,
  boxWidth,
}: GetDotPositionOpts): CSSProperties {
  const value = byteVal / STEPS;
  const width = boxWidth + 4;
  const height = boxHeight + 2;
  const total = height * 2 + width;
  const basePercent = 1 / (height * 2 + width);
  const heightP = height * basePercent;
  const widthP = width * basePercent;

  const isFirstThird = value < heightP;
  const isSecondThird = !isFirstThird && value < heightP + widthP;

  if (isFirstThird) {
    return {
      left: "0px",
      top: height - value * total,
    };
  }

  if (isSecondThird) {
    return {
      top: 0,
      left: (value - heightP) * total,
    };
  }

  return {
    left: `${width}px`,
    top: (value - heightP - widthP) * total,
  };
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
  $box: HTMLDivElement;
  setValue: Dispatch<SetStateAction<number>>;
};
function createDragHandler({ $box, setValue }: DragHandlerOpts) {
  return (ev: PointerEvent) => {
    const boxRect = $box.getBoundingClientRect();
    const width = boxRect.width - 4;
    const height = boxRect.height - 2;
    const x = ev.clientX - boxRect.left - 3;
    const y = ev.clientY - boxRect.top - 3;

    const basePercent = 1 / (height * 2 + width);
    const heightP = height * basePercent;
    const widthP = width * basePercent;

    const isFirstThird = x < width / 2;
    const isSecondThird = isFirstThird ? x > y : width - x > y;

    let value = 0;
    if (isSecondThird) {
      const pos = Math.min(width, Math.max(x, 0));
      value = heightP + basePercent * pos;
    } else if (isFirstThird) {
      const pos = Math.min(height, Math.max(y, 0));
      value = basePercent * (height - pos);
    } else {
      const pos = Math.min(height, Math.max(y, 0));
      value = heightP + widthP + basePercent * pos;
    }
    setValue(Math.round(STEPS * value));
  };
}

function isHTMLDivElement(target: EventTarget): target is HTMLDivElement {
  return (target as HTMLDivElement).nodeName === "DIV";
}
