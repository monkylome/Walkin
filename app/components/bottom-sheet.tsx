"use client";

import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { useRouter } from "next/navigation";
import { toStoreSlug, directionsUrl } from "@/app/lib/items";
import DistanceChips from "@/app/components/distance-chips";
import StoreLogo from "@/app/components/store-logo";
import { XIcon } from "@/app/components/icons";
import { VerifiedTick } from "@/app/components/store-badges";

export type SheetStore = {
  id: number;
  name: string;
  category: string;
  distance: string;
  walkTime: string;
  caption: string;
  verified?: boolean;
};

type Props = {
  store: SheetStore | null;
  onClose: () => void;
};

const CLOSE_THRESHOLD = 100;
const CLOSE_VELOCITY  = 0.4;
const DRAG_SLOP = 6;

type DragSample = {
  y: number;
  time: number;
};

const SLIDE_MS = 320;

export default function BottomSheet({ store, onClose }: Props) {
  const router    = useRouter();
  const [dragY,   setDragY]   = useState(0);
  const [dismissed, setDismissed] = useState(!store);
  const [isDragging, setIsDragging] = useState(false);
  const displayed = useRef<SheetStore | null>(store);
  const displayedId = useRef<number | null>(store?.id ?? null);
  const dragging   = useRef(false);
  const pointerId  = useRef<number | null>(null);
  const canStartDrag = useRef(false);
  const startX     = useRef(0);
  const startY     = useRef(0);
  const previous   = useRef<DragSample | null>(null);
  const latest     = useRef<DragSample | null>(null);

  if (store) {
    displayed.current = store;

    if (displayedId.current !== store.id) {
      displayedId.current = store.id;
      if (dragY !== 0) setDragY(0);
    }

    if (dismissed) setDismissed(false);
  }

  function dismiss() {
    onClose();
  }

  function resetDrag() {
    dragging.current = false;
    pointerId.current = null;
    canStartDrag.current = false;
    previous.current = null;
    latest.current = null;
  }

  function isInteractiveTarget(target: EventTarget | null) {
    return target instanceof HTMLElement && Boolean(target.closest("button, a, input, textarea, select, [role='button']"));
  }

  function beginDrag(clientY: number) {
    const sample = { y: clientY, time: performance.now() };
    dragging.current  = true;
    startY.current    = clientY;
    previous.current  = sample;
    latest.current    = sample;
    setDragY(0);
    setIsDragging(true);
  }

  function startMouseDrag(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if (isInteractiveTarget(e.target)) return;

    pointerId.current = e.pointerId;
    beginDrag(e.clientY);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function mouseDrag(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current || pointerId.current !== e.pointerId) return;

    const sample = { y: e.clientY, time: performance.now() };
    previous.current = latest.current;
    latest.current = sample;
    setDragY(Math.max(0, e.clientY - startY.current));
  }

  function finishMouseDrag(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current || pointerId.current !== e.pointerId) return;
    finishDrag(e.clientY);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function finishDrag(clientY: number) {
    const delta = Math.max(0, clientY - startY.current);
    const prev = previous.current;
    const current = { y: clientY, time: performance.now() };
    const elapsed = prev ? Math.max(1, current.time - prev.time) : 1;
    const velocity = prev ? (current.y - prev.y) / elapsed : 0;

    resetDrag();
    setIsDragging(false);

    if (delta > CLOSE_THRESHOLD || velocity > CLOSE_VELOCITY) {
      dismiss();
    } else {
      setDragY(0);
    }
  }

  function cancelDrag(e: ReactPointerEvent<HTMLDivElement>) {
    if (pointerId.current !== e.pointerId) return;
    resetDrag();
    setIsDragging(false);
    setDragY(0);
  }

  function startTouchDrag(e: ReactTouchEvent<HTMLDivElement>) {
    if (isInteractiveTarget(e.target)) return;

    const touch = e.touches[0];
    if (!touch) return;

    canStartDrag.current = true;
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    previous.current = { y: touch.clientY, time: performance.now() };
    latest.current = previous.current;
  }

  function touchDrag(e: ReactTouchEvent<HTMLDivElement>) {
    if (!canStartDrag.current) return;

    const touch = e.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;

    if (!dragging.current) {
      if (Math.abs(deltaX) > Math.abs(deltaY) || Math.abs(deltaY) < DRAG_SLOP) return;
      if (deltaY < 0) {
        canStartDrag.current = false;
        return;
      }
      beginDrag(touch.clientY);
    }

    e.preventDefault();
    const sample = { y: touch.clientY, time: performance.now() };
    previous.current = latest.current;
    latest.current = sample;
    setDragY(Math.max(0, deltaY));
  }

  function endTouchDrag(e: ReactTouchEvent<HTMLDivElement>) {
    if (!canStartDrag.current) return;

    const touch = e.changedTouches[0];
    if (dragging.current && touch) {
      finishDrag(touch.clientY);
      return;
    }

    resetDrag();
  }

  function cancelTouchDrag() {
    resetDrag();
    setIsDragging(false);
    setDragY(0);
  }

  function finishClose() {
    if (store) return;
    displayed.current = null;
    displayedId.current = null;
    setDismissed(true);
    setDragY(0);
  }

  const current = displayed.current;
  if (!current || dismissed) return null;

  const transform  = store ? `translateY(${dragY}px)` : "translateY(100%)";
  const transition = isDragging ? "none" : "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)";

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-20 bg-background rounded-t-3xl shadow-[0_-8px_24px_rgb(0_0_0/0.12)] ${
        store && !isDragging ? "bottom-sheet-enter" : ""
      }`}
      style={{ transform, transition, touchAction: "pan-y" }}
      onPointerDown={startMouseDrag}
      onPointerMove={mouseDrag}
      onPointerUp={finishMouseDrag}
      onPointerCancel={cancelDrag}
      onTouchStart={startTouchDrag}
      onTouchMove={touchDrag}
      onTouchEnd={endTouchDrag}
      onTouchCancel={cancelTouchDrag}
      onTransitionEnd={(e) => {
        if (e.propertyName === "transform") finishClose();
      }}
    >
      {/* Drag handle */}
      <div className="pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing">
        <div className="w-10 h-1 rounded-full bg-border" />
      </div>

      <div className="px-5 pb-8">
        {/* Store header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <StoreLogo name={current.name} size="md" />
            <div>
              <div className="flex min-w-0 items-center gap-1.5">
                <h2 className="text-[20px] font-bold text-foreground leading-tight">{current.name}</h2>
                {current.verified && <VerifiedTick />}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-surface border border-border text-muted">
                  {current.category}
                </span>
                <span className="text-[12px] text-muted">{current.caption}</span>
              </div>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted shrink-0 mt-0.5"
          >
            <XIcon />
          </button>
        </div>

        {/* Distance row */}
        <div className="mb-5">
          <DistanceChips distance={current.distance} walkTime={current.walkTime} />
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              const slug = toStoreSlug(current.name);
              dismiss();
              setTimeout(() => router.push(`/store/${slug}`), SLIDE_MS);
            }}
            className="flex-1 py-3.5 rounded-2xl border border-border bg-surface text-foreground font-semibold text-[15px] active:opacity-70 transition-opacity"
          >
            View store
          </button>
          <a
            href={directionsUrl(current.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 rounded-2xl bg-primary text-white font-semibold text-[15px] active:opacity-80 transition-opacity text-center"
          >
            Get directions
          </a>
        </div>
      </div>
    </div>
  );
}
