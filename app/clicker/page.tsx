"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import "./clicker.css";

type Upgrade = {
  id: string;
  icon: string;
  name: string;
  subtitle: string;
  baseCost: number;
  baseRate: number;
  level: number;
};

const freshUpgrades: Upgrade[] = [
  { id: "bin", icon: "🗑️", name: "Dumpster Dive", subtitle: "A very committed paw", baseCost: 30, baseRate: 1, level: 0 },
  { id: "salmon", icon: "🐟", name: "Seattle Salmon", subtitle: "Fin-fluencer income", baseCost: 200, baseRate: 6, level: 0 },
  { id: "needle", icon: "🗼", name: "Space Needle Signal", subtitle: "Broadcasting trash lore", baseCost: 1250, baseRate: 32, level: 0 },
  { id: "ballard", icon: "🌲", name: "Ballard Park Crew", subtitle: "The night shift has arrived", baseCost: 7500, baseRate: 160, level: 0 },
];

const skins = [
  { id: "classic", name: "Classic Jimothy", cost: 0, note: "Born for the bin" },
  { id: "sleepy", name: "Sleepy Jimothy", cost: 750, note: "Two naps, one trash can" },
  { id: "saint", name: "Saint Jimothy", cost: 6000, note: "Bless this mess" },
  { id: "summer", name: "Hot Jimothy Summer", cost: 25000, note: "Sun's out, bins out" },
] as const;

const skinImages: Record<(typeof skins)[number]["id"], string> = {
  classic: "/assets/jimothy-raccoon-cropped.png",
  sleepy: "/assets/jimothy-sleepy-transparent.png",
  saint: "/assets/jimothy-saint-transparent.png",
  summer: "/assets/jimothy-summer-transparent.png",
};

const stageMessages = [
  "Ballard has noticed you.",
  "Seattle Salmon has joined the cause.",
  "The Space Needle is glowing green.",
  "Legendary trash status unlocked.",
];

const format = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return Math.floor(value).toLocaleString();
};

export default function JimothyClickerPage() {
  const [points, setPoints] = useState(0);
  const [upgrades, setUpgrades] = useState(freshUpgrades);
  const [skin, setSkin] = useState<(typeof skins)[number]["id"]>("classic");
  const [ownedSkins, setOwnedSkins] = useState<string[]>(["classic"]);
  const [dimension, setDimension] = useState(0);
  const [toast, setToast] = useState("Welcome to the trash dimension.");
  const [stage, setStage] = useState(0);
  const [floaters, setFloaters] = useState<{ id: number; x: number; y: number; value: number }[]>([]);

  const clickValue = 1 + dimension * 2 + Math.floor(upgrades.reduce((sum, item) => sum + item.level, 0) / 8);
  const perSecond = useMemo(
    () => upgrades.reduce((sum, item) => sum + item.level * item.baseRate, 0) * (1 + dimension * 0.2),
    [upgrades, dimension],
  );
  const progressGoal = [100, 1_000, 10_000, 75_000][Math.min(stage, 3)];
  const canPrestige = points >= 100_000;
  const activeSkin = skins.find((item) => item.id === skin) ?? skins[0];

  useEffect(() => {
    const saved = window.localStorage.getItem("jimothy-clicker-save");
    if (!saved) return;
    try {
      const state = JSON.parse(saved);
      setPoints(state.points ?? 0);
      setUpgrades(state.upgrades ?? freshUpgrades);
      setSkin(state.skin ?? "classic");
      setOwnedSkins(state.ownedSkins ?? ["classic"]);
      setDimension(state.dimension ?? 0);
      setStage(state.stage ?? 0);
    } catch {
      // A malformed old save should not block a new game.
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setPoints((value) => value + perSecond / 5), 200);
    return () => window.clearInterval(timer);
  }, [perSecond]);

  useEffect(() => {
    window.localStorage.setItem("jimothy-clicker-save", JSON.stringify({ points, upgrades, skin, ownedSkins, dimension, stage }));
  }, [points, upgrades, skin, ownedSkins, dimension, stage]);

  useEffect(() => {
    if (stage < 4 && points >= progressGoal) {
      setStage((value) => value + 1);
      setToast(stageMessages[stage]);
    }
  }, [points, progressGoal, stage]);

  const tap = (event: MouseEvent<HTMLButtonElement>) => {
    setPoints((value) => value + clickValue);
    const rect = event.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setFloaters((items) => [...items, { id, x: event.clientX - rect.left, y: event.clientY - rect.top, value: clickValue }]);
    window.setTimeout(() => setFloaters((items) => items.filter((item) => item.id !== id)), 700);
  };

  const buyUpgrade = (id: string) => {
    const item = upgrades.find((upgrade) => upgrade.id === id);
    if (!item) return;
    const cost = Math.floor(item.baseCost * Math.pow(1.18, item.level));
    if (points < cost) return setToast("Not enough Trash Points. Keep tapping.");
    setPoints((value) => value - cost);
    setUpgrades((items) => items.map((upgrade) => upgrade.id === id ? { ...upgrade, level: upgrade.level + 1 } : upgrade));
    setToast(`${item.name} upgraded. The bins are working overtime.`);
  };

  const chooseSkin = (item: (typeof skins)[number]) => {
    if (ownedSkins.includes(item.id)) {
      setSkin(item.id);
      return setToast(`${item.name} equipped.`);
    }
    if (points < item.cost) return setToast("That look is still out of reach.");
    setPoints((value) => value - item.cost);
    setOwnedSkins((items) => [...items, item.id]);
    setSkin(item.id);
    setToast(`${item.name} unlocked. Screenshot-worthy.`);
  };

  const prestige = () => {
    if (!canPrestige) return;
    setDimension((value) => value + 1);
    setPoints(0);
    setUpgrades(freshUpgrades);
    setStage(0);
    setToast("You returned to the Trash Dimension. +20% all passive income.");
  };

  const share = async () => {
    const text = `I have ${format(points)} Trash Points in Jimothy Clicker 🗑️🦝`;
    try {
      await navigator.clipboard.writeText(text);
      setToast("Brag text copied. Send it to the group chat.");
    } catch {
      setToast(text);
    }
  };

  return (
    <main className="clicker-page">
      <nav className="clicker-nav">
        <a className="clicker-brand" href="#top" aria-label="Jimothy Clicker home"><span>JIMOTHY</span> CLICKER</a>
        <div><a href="#how">HOW TO PLAY</a><a href="#upgrades">UPGRADES</a><a href="#faq">FAQ</a></div>
        <button onClick={share}>↗ SHARE</button>
      </nav>

      <section className="clicker-game" id="top">
        <aside className="clicker-panel clicker-stats">
          <div className="clicker-panel-title">TRASH EMPIRE <span>◈</span></div>
          <div className="clicker-stat-card"><small>TRASH POINTS</small><strong>{format(points)}</strong><em>+{format(perSecond)} / second</em></div>
          <div className="clicker-stat-card clicker-compact"><span>Dimension</span><strong>{dimension + 1}</strong><em>+{dimension * 20}% income</em></div>
          <div className="clicker-stage"><div><span>LEGEND TRACK</span><b>{Math.min(stage + 1, 4)} / 4</b></div><div className="clicker-meter"><i style={{ width: `${Math.min(100, (points / progressGoal) * 100)}%` }} /></div><p>{stage >= 4 ? "You are a Seattle legend." : `Next story beat at ${format(progressGoal)} TP`}</p></div>
          <button className={`clicker-prestige ${canPrestige ? "ready" : ""}`} onClick={prestige}><span>↻</span><div><b>RETURN TO THE<br />TRASH DIMENSION</b><small>{canPrestige ? "READY TO RETURN" : "NEEDS 100K TP"}</small></div></button>
        </aside>

        <section className="clicker-play-area">
          <div className="clicker-sky"><div className="clicker-moon" /><div className="clicker-needle">▲</div><div className="clicker-stars" /></div>
          <div className="clicker-hud"><span>HOT JIMOTHY SUMMER</span><span>◉ BALLARD, SEATTLE</span></div>
          <div className="clicker-heading"><p>THE FREE VIRAL RACCOON CLICKER</p><h1>Jimothy Clicker – Play the Viral Raccoon Game Free</h1></div>
          <div className="clicker-speech"><b>{toast}</b><span>Tap Jimothy. Let the trash flow.</span></div>
          <button className={`clicker-jimothy skin-${skin}`} onClick={tap} aria-label="Tap Jimothy for Trash Points"><img src={skinImages[activeSkin.id]} alt={`${activeSkin.name} raccoon artwork`} />{floaters.map((floater) => <span key={floater.id} className="clicker-floater" style={{ left: floater.x, top: floater.y }}>+{floater.value}</span>)}</button>
          <div className="clicker-tap-prompt">TAP JIMOTHY <span>✦</span></div>
          <div className="clicker-ground"><span>🗑️</span><span>🍕</span><span>📰</span><span>🐟</span></div>
        </section>

        <aside className="clicker-panel clicker-upgrades" id="upgrades">
          <div className="clicker-panel-title">AUTO DUMPSTERS <span>⌁</span></div>
          <p>Hire the night shift. Every upgrade earns while you vibe.</p>
          <div>{upgrades.map((item) => { const cost = Math.floor(item.baseCost * Math.pow(1.18, item.level)); return <button className="clicker-upgrade" key={item.id} onClick={() => buyUpgrade(item.id)}><span className="clicker-upgrade-icon">{item.icon}</span><span><b>{item.name}</b><small>{item.subtitle}</small><em>Lv. {item.level} · +{format(item.baseRate * (1 + dimension * 0.2))}/sec</em></span><strong>{format(cost)}<small>TP</small></strong></button>; })}</div>
          <div className="clicker-tip"><span>✦</span> Pro tip: upgrade the bins before you log off. Jimothy never clocks out.</div>
        </aside>
      </section>

      <section className="clicker-copy-section" id="how"><p>HOW TO PLAY</p><h2>How to Play Jimothy Clicker</h2><div className="clicker-guide"><article><span>01</span><h3>Tap Jimothy</h3><p>Click or tap Jimothy to earn Trash Points and start your raccoon empire.</p></article><article><span>02</span><h3>Buy Auto Dumpsters</h3><p>Spend points on upgrades that generate passive Trash Points every second.</p></article><article><span>03</span><h3>Return stronger</h3><p>Reach 100K points to return to the Trash Dimension and gain a 20% income boost.</p></article></div></section>

      <section className="clicker-collection"><p>COLLECT THE LORE</p><h2>Every Seattle legend needs a look.</h2><div className="clicker-skins">{skins.map((item) => <button className={skin === item.id ? "selected" : ""} key={item.id} onClick={() => chooseSkin(item)}><span><img src={skinImages[item.id]} alt="" /></span><b>{item.name}</b><small>{item.note}</small><em>{ownedSkins.includes(item.id) ? (skin === item.id ? "EQUIPPED" : "OWNED") : `${format(item.cost)} TP`}</em></button>)}</div></section>

      <section className="clicker-faq" id="faq"><p>FAQ</p><h2>Jimothy Clicker FAQ</h2><div>{[["What is Jimothy Clicker?", "It's a free browser raccoon clicker game. Tap Jimothy, collect Trash Points, and grow a wildly efficient trash empire."], ["How do I earn points faster?", "Keep tapping to build your first balance, then purchase Auto Dumpster upgrades for passive income."], ["Is Jimothy Clicker free to play?", "Yes. It plays directly in your browser with no download required."], ["What does returning to the Trash Dimension do?", "At 100K Trash Points you can reset your current run for a permanent 20% passive-income bonus."], ["Do my game progress and skins save?", "Yes. Progress saves automatically in this browser on your device."], ["What are skins for?", "Skins give Jimothy a new look. Unlock them with Trash Points and equip any look you own."]].map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>

      <footer className="clicker-footer"><span>JIMOTHY CLICKER</span><p>A fan-made Seattle meme clicker. Please admire wildlife from a respectful distance.</p><a href="#top">BACK TO THE BINS ↑</a></footer>
    </main>
  );
}
