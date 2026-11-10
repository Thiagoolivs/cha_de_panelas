"use client";

import { forwardRef, memo } from "react";
import type { GiftView, HouseItem, Room } from "@/lib/types";
import { ROOMS } from "@/lib/types";
import { ICONS, iconFor } from "@/components/icons/catalog";
import { ROOM_LABEL } from "@/content/gifts-copy";
import { ROOM_BOXES, VIEW, perspective } from "./geometry";
import { RoomShell } from "./RoomShell";
import { Furniture, HouseFrame } from "./Furniture";
import { resolveSlots, type Slot } from "./slots";

export interface HouseProps {
  items: HouseItem[];
  gifts: Map<string, GiftView>;
  focus: Room | null;
  /** Item que ainda não deve aparecer (vai cair no slot durante a reação). */
  hiddenGiftId?: string | null;
  onRoom(room: Room): void;
  onItem(giftId: string): void;
  /** Camadas extras por cômodo (personagens), desenhadas por cima dos itens. */
  overlay?: Partial<Record<Room, React.ReactNode>>;
  /** Grupo do item que está caindo (a animação mexe no transform dele). */
  dropRef?: React.Ref<SVGGElement>;
  dropGiftId?: string | null;
}

/** Desenha um ícone num slot, empilhando quando há mais de uma unidade. */
export function SlotGlyph({ slot, iconKey, count }: { slot: Slot; iconKey: string; count: number }) {
  const s = slot.s;
  const tx = slot.x - 50 * s;
  const ty = slot.hang ? slot.y - 2 * s : slot.y - 100 * s;
  const n = Math.min(Math.max(count, 1), 3);
  const copies = Array.from({ length: n }, (_, i) => n - 1 - i); // de trás para frente
  const def = iconFor(iconKey);
  return (
    <g transform={`translate(${tx} ${ty}) scale(${s})`}>
      {copies.map((k) => {
        const off =
          slot.stack === "side" ? `translate(${k * (slot.hang ? 22 : 28)} 0)` : `translate(${k * 10} ${-k * 7})`;
        return (
          <g key={k} transform={k ? off : undefined}>
            {def.body}
          </g>
        );
      })}
      <rect x={0} y={0} width={100} height={100} fill="transparent" stroke="none" />
    </g>
  );
}

function RoomLayer({
  room,
  items,
  gifts,
  focus,
  hiddenGiftId,
  onRoom,
  onItem,
  overlay,
  dropRef,
  dropGiftId,
}: Omit<HouseProps, "items" | "overlay"> & { room: Room; items: HouseItem[]; overlay?: React.ReactNode }) {
  const b = ROOM_BOXES[room];
  const { back } = perspective(b);
  const resolved = resolveSlots(items, (k) => !!ICONS[k]);
  const ordered = items
    .map((it) => ({ it, r: resolved.get(it.giftId) }))
    .filter((x): x is { it: HouseItem; r: NonNullable<typeof x.r> } => !!x.r)
    .sort((a, z) => a.r.slot.z - z.r.slot.z || a.r.slot.y - z.r.slot.y);

  const zoomed = focus === room;
  const dimmed = focus !== null && !zoomed;
  const label = ROOM_LABEL[room];

  return (
    <g
      transform={`translate(${b.x} ${b.y})`}
      style={{ opacity: dimmed ? 0.35 : 1, transition: "opacity 500ms ease" }}
      data-room={room}
    >
      <g
        role={zoomed ? undefined : "button"}
        tabIndex={zoomed ? undefined : 0}
        aria-label={zoomed ? undefined : `Ver ${label}`}
        onClick={zoomed ? undefined : () => onRoom(room)}
        onKeyDown={(e) => {
          if (!zoomed && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onRoom(room);
          }
        }}
        style={{ cursor: zoomed ? "default" : "zoom-in", outline: "none" }}
        className="house-room"
      >
        <RoomShell box={b} floor={room === "cozinha" || room === "servico" ? "tile" : "wood"} />
        <Furniture room={room} />
        <text
          x={back.x0 + 6}
          y={back.y0 - 8}
          fontSize={11}
          letterSpacing={2.2}
          fill="var(--olive-700)"
          stroke="none"
          style={{ fontFamily: "var(--font-montserrat)", textTransform: "uppercase", fontWeight: 500 }}
          aria-hidden="true"
        >
          {label.toUpperCase()}
        </text>
        <rect x={0} y={0} width={b.w} height={b.h} fill="transparent" stroke="none" className="house-focus-ring" />
      </g>

      {ordered.map(({ it, r }) => {
        const gift = gifts.get(it.giftId);
        if (it.giftId === hiddenGiftId) return null;
        const glyph = <SlotGlyph slot={r.slot} iconKey={r.iconKey} count={it.count} />;
        const isDrop = it.giftId === dropGiftId;
        return (
          <g
            key={it.giftId}
            ref={isDrop ? dropRef : undefined}
            data-item={it.giftId}
            role={zoomed ? "button" : undefined}
            tabIndex={zoomed ? 0 : undefined}
            aria-label={zoomed && gift ? gift.title : undefined}
            onClick={zoomed ? () => onItem(it.giftId) : () => onRoom(room)}
            onKeyDown={(e) => {
              if (zoomed && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onItem(it.giftId);
              }
            }}
            style={{ cursor: zoomed ? "pointer" : "zoom-in", outline: "none" }}
            className="house-item"
          >
            {glyph}
          </g>
        );
      })}
      {overlay}
    </g>
  );
}

export const House = memo(
  forwardRef<SVGSVGElement, HouseProps>(function House(props, ref) {
    const byRoom = new Map<Room, HouseItem[]>(ROOMS.map((r) => [r, []]));
    for (const it of props.items) byRoom.get(it.room)?.push(it);
    return (
      <svg
        ref={ref}
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
        className="lineart block h-auto w-full touch-manipulation select-none"
        fill="none"
        stroke="var(--olive-700)"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="group"
        aria-label="Casinha dos noivos"
      >
        <HouseFrame />
        {ROOMS.map((room) => (
          <RoomLayer
            key={room}
            room={room}
            items={byRoom.get(room) ?? []}
            gifts={props.gifts}
            focus={props.focus}
            hiddenGiftId={props.hiddenGiftId}
            onRoom={props.onRoom}
            onItem={props.onItem}
            overlay={props.overlay?.[room]}
            dropRef={props.dropRef}
            dropGiftId={props.dropGiftId}
          />
        ))}
      </svg>
    );
  }),
);
