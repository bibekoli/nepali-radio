import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import { ChevronDown, Headphones, Heart, MapPin, Pause, Play, Radio as RadioIcon, RotateCcw, Search, SkipBack, SkipForward, Sparkles, Volume2, VolumeX, Waves } from "lucide-react";
import { radios } from "@/data/radios";
import { useRadioStore } from "@/data/zustand";
import { formatFrequency, getProvinceNames } from "@/lib/utils";
import RadioCard from "@/components/RadioCard";
import Spinner from "@/components/Spinner";

export default function Index() {
  const store = useRadioStore();
  const { current, setCurrent, searchQuery, selectedProvince, showFavoritesOnly, favorites, volume, isMuted, setSearchQuery, setSelectedProvince, toggleShowFavoritesOnly, clearFilters, setVolume, toggleMute } = store;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const provinces = getProvinceNames();

  useEffect(() => { if (audioRef.current) { audioRef.current.volume = volume; audioRef.current.muted = isMuted; } }, [volume, isMuted]);
  useEffect(() => setVisibleCount(24), [searchQuery, selectedProvince, showFavoritesOnly]);

  const filteredRadios = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return radios.filter((radio) => {
      const matchesSearch = !query || [radio.name, radio.address, radio.frequency?.toString()].some((value) => value?.toLowerCase().includes(query));
      return matchesSearch && (selectedProvince === null || radio.province === selectedProvince) && (!showFavoritesOnly || favorites.includes(radio.id));
    });
  }, [searchQuery, selectedProvince, showFavoritesOnly, favorites]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    try { if (audioRef.current.paused) await audioRef.current.play(); else audioRef.current.pause(); }
    catch { setIsBuffering(false); toast.error("This station is unavailable right now."); }
  };
  const selectStation = (radio: RadioItem) => { if (current?.id === radio.id) togglePlay(); else { setIsBuffering(true); setCurrent(radio); } };
  const moveStation = (direction: number) => {
    const pool = filteredRadios.length ? filteredRadios : radios;
    const index = pool.findIndex((radio) => radio.id === current?.id);
    setIsBuffering(true); setCurrent(pool[(Math.max(index, 0) + direction + pool.length) % pool.length]);
  };
  const chooseProvince = (province: number | null) => { setSelectedProvince(province); if (showFavoritesOnly) toggleShowFavoritesOnly(); };
  const heroStation = current ?? radios[0];
  const activeFilters = Number(selectedProvince !== null) + Number(showFavoritesOnly) + Number(Boolean(searchQuery));

  return (
    <div className="min-h-screen bg-[#f7f7f2] text-slate-950">
      <Toaster position="top-center" toastOptions={{ style: { background: "#101b24", color: "white", borderRadius: "14px" } }} />
      <header className="sticky top-0 z-40 border-b border-slate-900/10 bg-[#f7f7f2]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <button className="flex shrink-0 items-center gap-2.5" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ff4d2e] text-white shadow-[0_8px_24px_rgba(255,77,46,.28)]"><Waves className="h-5 w-5" /></span>
            <span className="text-xl font-bold tracking-[-0.04em]">BiTunes</span>
          </button>
          <nav className="ml-8 hidden items-center gap-7 text-sm font-medium text-slate-500 lg:flex"><a href="#discover" className="text-slate-950">Discover</a><button onClick={toggleShowFavoritesOnly} className="hover:text-slate-950">Saved</button></nav>
          <label className="relative ml-auto hidden w-full max-w-sm md:block">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search station, city or frequency" className="h-10 w-full rounded-full border border-slate-900/10 bg-white/70 pl-10 pr-4 text-sm outline-none transition focus:border-[#ff4d2e]/50 focus:bg-white focus:ring-4 focus:ring-[#ff4d2e]/10" />
          </label>
          <button onClick={toggleShowFavoritesOnly} aria-label="Show saved stations" className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition ${showFavoritesOnly ? "border-[#ff4d2e] bg-[#ff4d2e] text-white" : "border-slate-900/10 bg-white text-slate-700 hover:border-slate-900/25"}`}>
            <Heart className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
            {favorites.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ffd166] px-1 text-[10px] font-bold text-slate-950">{favorites.length}</span>}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 pb-44 pt-5 sm:px-6 sm:pt-8 lg:px-10">
        <section className="relative overflow-hidden rounded-[28px] bg-[#101b24] px-6 py-7 text-white sm:px-9 sm:py-9 lg:min-h-[350px] lg:px-12 lg:py-11">
          <div className="hero-grid absolute inset-0 opacity-25" /><div className="absolute -right-28 -top-40 h-[420px] w-[420px] rounded-full bg-[#ff4d2e]/25 blur-3xl" />
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_420px]">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ffd166]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#ff4d2e]" />Live from Nepal</div>
              <h1 className="text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-6xl">Nepal sounds<br />better <span className="text-[#ff735c]">live.</span></h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">News, music, stories and voices from across the country—one tap away, wherever you are.</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button onClick={() => selectStation(heroStation)} className="flex h-12 items-center gap-3 rounded-full bg-[#ff4d2e] px-6 text-sm font-bold shadow-[0_12px_32px_rgba(255,77,46,.3)] transition hover:-translate-y-0.5 hover:bg-[#ff6247]">
                  {current?.id === heroStation.id && isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}{current?.id === heroStation.id && isPlaying ? "Pause live radio" : "Start listening"}
                </button>
                <div className="flex items-center gap-2 px-2 text-xs font-medium text-slate-400"><Headphones className="h-4 w-4" /> {radios.length}+ stations</div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-8 rounded-full bg-[#ffd166]/10 blur-2xl" />
              <div className="relative ml-auto aspect-square w-72 rounded-full border border-white/10 bg-white/[.06] p-5 shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-full border-8 border-[#172731] bg-white"><Image src={`/logo/${heroStation.id}.jpg`} alt={heroStation.name} fill className="object-cover" priority onError={(event) => { event.currentTarget.style.display = "none"; }} /></div>
                <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ repeat: isPlaying ? Infinity : 0, duration: 8, ease: "linear" }} className="absolute inset-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-[#101b24] bg-[#ff4d2e]" />
              </div>
              <div className="absolute bottom-3 left-0 rounded-2xl border border-white/10 bg-[#172731]/95 px-4 py-3 shadow-xl backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffd166]">Featured station</p><p className="mt-1 max-w-44 truncate text-sm font-semibold">{heroStation.name}</p></div>
            </div>
          </div>
        </section>

        <section id="discover" className="scroll-mt-24 pt-10 sm:pt-14">
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff4d2e]"><Sparkles className="h-3.5 w-3.5" /> Explore the airwaves</div><h2 className="mt-2 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">Find your frequency</h2><p className="mt-2 text-sm text-slate-500">{filteredRadios.length} stations ready to stream</p></div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block md:hidden"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search stations" className="h-11 w-full rounded-xl border border-slate-900/10 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#ff4d2e]/50" /></label>
              <label className="relative"><MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><select value={selectedProvince ?? ""} onChange={(e) => setSelectedProvince(e.target.value ? Number(e.target.value) : null)} className="h-11 w-full appearance-none rounded-xl border border-slate-900/10 bg-white pl-10 pr-10 text-sm font-medium outline-none focus:border-[#ff4d2e]/50 sm:w-56"><option value="">All provinces</option>{Object.entries(provinces).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></label>
            </div>
          </div>
          <div className="mb-7 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button onClick={() => chooseProvince(null)} className={`filter-chip ${selectedProvince === null && !showFavoritesOnly ? "filter-chip-active" : ""}`}>All stations</button>
            <button onClick={toggleShowFavoritesOnly} className={`filter-chip ${showFavoritesOnly ? "filter-chip-active" : ""}`}><Heart className={`h-3.5 w-3.5 ${showFavoritesOnly ? "fill-current" : ""}`} /> Saved</button>
            {Object.entries(provinces).map(([id, name]) => <button key={id} onClick={() => chooseProvince(Number(id))} className={`filter-chip ${selectedProvince === Number(id) && !showFavoritesOnly ? "filter-chip-active" : ""}`}>{name.replace(" Province", "")}</button>)}
            {activeFilters > 0 && <button onClick={clearFilters} className="ml-1 flex shrink-0 items-center gap-1.5 px-3 text-xs font-semibold text-slate-500 hover:text-[#ff4d2e]"><RotateCcw className="h-3.5 w-3.5" /> Reset</button>}
          </div>
          <AnimatePresence mode="popLayout">
            {filteredRadios.length ? <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">{filteredRadios.slice(0, visibleCount).map((radio, index) => <RadioCard key={radio.id} radio={radio} index={index} isPlaying={isPlaying} onPlay={selectStation} />)}</motion.div> :
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center"><RadioIcon className="mx-auto h-10 w-10 text-slate-300" /><h3 className="mt-4 text-lg font-bold">No signal found</h3><p className="mt-1 text-sm text-slate-500">Try another search or clear the current filters.</p><button onClick={clearFilters} className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white">Clear filters</button></motion.div>}
          </AnimatePresence>
          {visibleCount < filteredRadios.length && <div className="mt-9 text-center"><button onClick={() => setVisibleCount((count) => count + 20)} className="rounded-full border border-slate-900/15 bg-white px-6 py-3 text-sm font-bold shadow-sm hover:border-slate-900/30">Show more stations</button></div>}
        </section>
      </main>

      <AnimatePresence>{current && <motion.aside initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }} className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-5xl overflow-hidden rounded-[22px] border border-white/10 bg-[#101b24]/95 text-white shadow-[0_22px_70px_rgba(10,20,28,.35)] backdrop-blur-xl sm:bottom-5 sm:left-5 sm:right-5">
        {isBuffering && <div className="absolute left-0 right-0 top-0 h-0.5 overflow-hidden bg-white/10"><div className="loading-bar h-full bg-[#ff4d2e]" /></div>}
        <div className="flex h-[78px] items-center gap-3 px-3 sm:h-[88px] sm:gap-5 sm:px-5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white sm:h-14 sm:w-14"><Image src={`/logo/${current.id}.jpg`} alt={current.name} fill className="object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /></div>
          <div className="min-w-0 flex-1 sm:max-w-[240px]"><div className="mb-0.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#ff735c]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff4d2e]" /> Live now</div><p className="truncate text-sm font-bold sm:text-base">{current.name}</p><p className="truncate text-xs text-slate-400">{formatFrequency(current.frequency)}</p></div>
          <div className="flex items-center gap-1 sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:gap-2"><button onClick={() => moveStation(-1)} aria-label="Previous station" className="player-button hidden sm:grid"><SkipBack className="h-4 w-4 fill-current" /></button><button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="grid h-12 w-12 place-items-center rounded-full bg-[#ff4d2e] transition hover:scale-105 hover:bg-[#ff6247]">{isBuffering ? <Spinner className="h-5 w-5 animate-spin" /> : isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}</button><button onClick={() => moveStation(1)} aria-label="Next station" className="player-button grid"><SkipForward className="h-4 w-4 fill-current" /></button></div>
          <div className="ml-auto hidden items-center gap-3 lg:flex"><button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="text-slate-400 hover:text-white">{isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}</button><input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={(e) => setVolume(Number(e.target.value))} className="volume-slider w-24" /></div>
        </div>
        <audio ref={audioRef} src={current.streamUrl} autoPlay hidden onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onPlaying={() => setIsBuffering(false)} onWaiting={() => setIsBuffering(true)} onLoadStart={() => setIsBuffering(true)} onError={() => { setIsBuffering(false); setIsPlaying(false); toast.error("Couldn’t connect to this station."); }} />
      </motion.aside>}</AnimatePresence>
    </div>
  );
}
