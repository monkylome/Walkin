"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";

export type SheetStore = {
  id: number;
  name: string;
  category: string;
  distance: string;
  walkTime: string;
  itemCount: number;
  items: { name: string; stock: number }[];
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

export default function BottomSheet({ store, onClose }: Props) {
  const [dragY,   setDragY]   = useState(0);
  const [visible, setVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragging   = useRef(false);
  const pointerId  = useRef<number | null>(null);
  const canStartDrag = useRef(false);
  const startX     = useRef(0);
  const startY     = useRef(0);
  const previous   = useRef<DragSample | null>(null);
  const latest     = useRef<DragSample | null>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (store) {
        setDragY(0);
        setVisible(true);
      } else {
        setVisible(false);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [store]);

  function dismiss() {
    setVisible(false);
    setTimeout(onClose, 300);
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

  function isScrolledContent(target: EventTarget | null) {
    const scrollEl = scrollRef.current;
    return Boolean(scrollEl && target instanceof Node && scrollEl.contains(target) && scrollEl.scrollTop > 0);
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
    if (isInteractiveTarget(e.target) || isScrolledContent(e.target)) return;

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
    if (isInteractiveTarget(e.target) || isScrolledContent(e.target)) return;

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

  if (!store) return null;

  const transform  = visible ? `translateY(${dragY}px)` : "translateY(100%)";
  const transition = isDragging ? "none" : "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)";
  const backdropOp = visible ? Math.max(0, 1 - dragY / 300) : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 z-10"
        style={{
          opacity: backdropOp,
          transition: isDragging ? "none" : "opacity 0.32s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
        onClick={dismiss}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 bg-background rounded-t-3xl flex flex-col"
        style={{ transform, transition, height: "92vh", touchAction: "pan-y" }}
        onPointerDown={startMouseDrag}
        onPointerMove={mouseDrag}
        onPointerUp={finishMouseDrag}
        onPointerCancel={cancelDrag}
        onTouchStart={startTouchDrag}
        onTouchMove={touchDrag}
        onTouchEnd={endTouchDrag}
        onTouchCancel={cancelTouchDrag}
      >
        {/* Drag handle */}
        <div className="pt-3 pb-3 flex justify-center shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-10">
          {/* Store header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-[20px] font-bold text-foreground leading-tight">{store.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-surface border border-border text-muted">
                  {store.category}
                </span>
                <span className="text-[12px] text-muted">{store.itemCount} items listed</span>
              </div>
            </div>
            <button
              onClick={dismiss}
              className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted shrink-0 mt-0.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Distance row */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2.5 p-3 rounded-2xl bg-surface border border-border">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <div>
                <p className="text-[13px] font-semibold text-foreground">{store.distance}</p>
                <p className="text-[11px] text-muted">away</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2.5 p-3 rounded-2xl bg-surface border border-border">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <p className="text-[13px] font-semibold text-foreground">{store.walkTime}</p>
                <p className="text-[11px] text-muted">walk</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">In stock</p>
            <div className="flex flex-col gap-2">
              {store.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-surface border border-border">
                  <span className="text-[14px] font-medium text-foreground">{item.name}</span>
                  <span className={`text-[12px] font-semibold ${item.stock <= 2 ? "text-red-500" : "text-primary"}`}>
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-[15px] active:opacity-80 transition-opacity">
            Get directions
          </button>
        </div>
      </div>
    </>
  );
}
