import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import { Heart, MapPin, Pause, Play, Radio } from "lucide-react";
import { useRadioStore } from "@/data/zustand";
import { formatFrequency, getProvinceNames, cn } from "@/lib/utils";

interface RadioCardProps { radio: RadioItem; index: number; isPlaying: boolean; onPlay: (radio: RadioItem) => void; }

export default function RadioCard({ radio, index, isPlaying, onPlay }: RadioCardProps) {
  const { current, isFavorite, toggleFavorite } = useRadioStore();
  const isCurrent = current?.id === radio.id;
  const isFav = isFavorite(radio.id);
  const province = radio.province ? getProvinceNames()[radio.province].replace(" Province", "") : "Online";
  const toggleSaved = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleFavorite(radio.id);
    toast.success(isFav ? "Removed from saved stations" : "Saved for later");
  };

  return (
    <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, delay: Math.min(index, 10) * 0.025 }} onClick={() => onPlay(radio)}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onPlay(radio); } }}
      role="button" tabIndex={0} aria-label={`${isCurrent && isPlaying ? "Pause" : "Play"} ${radio.name}`}
      className={cn("group relative cursor-pointer overflow-hidden rounded-[22px] border bg-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(20,30,38,.10)] sm:p-4", isCurrent ? "border-[#ff4d2e] shadow-[0_16px_40px_rgba(255,77,46,.14)]" : "border-slate-900/[.08] hover:border-slate-900/20")}>
      <div className="relative aspect-[1.12/1] overflow-hidden rounded-2xl bg-[#eef0e9]">
        <div className="absolute inset-0 grid place-items-center"><Radio className="h-9 w-9 text-slate-300" /></div>
        <Image src={`/logo/${radio.id}.jpg`} alt="" fill className="object-cover transition duration-500 group-hover:scale-[1.04]" onError={(event) => { event.currentTarget.style.display = "none"; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-70" />
        <button onClick={toggleSaved} aria-label={isFav ? `Remove ${radio.name} from saved stations` : `Save ${radio.name}`}
          className={cn("absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition hover:scale-105", isFav ? "bg-[#ff4d2e] text-white" : "bg-white/85 text-slate-700 hover:bg-white")}>
          <Heart className={cn("h-3.5 w-3.5", isFav && "fill-current")} />
        </button>
        <button aria-label={`${isPlaying && isCurrent ? "Pause" : "Play"} ${radio.name}`} className={cn("absolute bottom-2.5 right-2.5 grid h-10 w-10 place-items-center rounded-full text-white shadow-lg transition group-hover:scale-105", isCurrent ? "bg-[#ff4d2e]" : "bg-[#101b24]")}>
          {isCurrent && isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
        </button>
        {isCurrent && <div className="absolute bottom-3 left-3 flex items-end gap-[3px]">{[12, 18, 9, 15].map((height, i) => <motion.span key={i} animate={{ height: [5, height, 7] }} transition={{ repeat: Infinity, duration: .75, delay: i * .12 }} className="w-[3px] rounded-full bg-white" />)}</div>}
      </div>
      <div className="px-0.5 pb-0.5 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-sm font-bold tracking-[-0.02em] text-slate-950 sm:text-base">{radio.name}</h3>
          <span className="shrink-0 rounded-md bg-[#fff1d0] px-1.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#8d5c00]">{formatFrequency(radio.frequency).replace(" MHz", "")}</span>
        </div>
        <p className="mt-1.5 flex items-center gap-1 truncate text-[11px] text-slate-500 sm:text-xs"><MapPin className="h-3 w-3 shrink-0" /> {province}</p>
      </div>
    </motion.article>
  );
}
