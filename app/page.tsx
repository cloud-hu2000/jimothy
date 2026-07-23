"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";

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
  { id: "classic", name: "Classic Jimothy", cost: 0, art: "🦝", note: "Born for the bin" },
  { id: "sleepy", name: "Sleepy Jimothy", cost: 750, art: "💤", note: "Two naps, one trash can" },
  { id: "saint", name: "Saint Jimothy", cost: 6000, art: "😇", note: "Bless this mess" },
  { id: "summer", name: "Hot Jimothy Summer", cost: 25000, art: "🕶️", note: "Sun’s out, bins out" },
];

const skinImages: Record<string, string> = {
  classic: "/assets/jimothy-raccoon-cropped.png",
  sleepy: "/assets/jimothy-sleepy-transparent.png",
  saint: "/assets/jimothy-saint-transparent.png",
  summer: "/assets/jimothy-summer-transparent.png",
};

const seoSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "VideoGame",
      name: "Jimothy Clicker",
      description: "A free browser clicker game where you tap Jimothy the raccoon, earn Trash Points, and unlock idle upgrades.",
      genre: ["Clicker", "Idle game", "Casual game"],
      gamePlatform: "Web browser",
      isAccessibleForFree: true,
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is Jimothy Clicker?", acceptedAnswer: { "@type": "Answer", text: "Jimothy Clicker is a free browser clicker game about tapping Jimothy the raccoon to earn Trash Points and grow a trash empire." } },
        { "@type": "Question", name: "How do I earn Trash Points?", acceptedAnswer: { "@type": "Answer", text: "Tap Jimothy to earn points directly, then buy Auto Dumpster upgrades to keep earning points over time." } },
        { "@type": "Question", name: "What happens when I return to the Trash Dimension?", acceptedAnswer: { "@type": "Answer", text: "At 100,000 Trash Points you can restart a run and gain a permanent 20 percent boost to passive income." } },
      ],
    },
  ],
};

const format = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return Math.floor(value).toLocaleString();
};

export default function Home() {
  const [points, setPoints] = useState(0);
  const [upgrades, setUpgrades] = useState(freshUpgrades);
  const [skin, setSkin] = useState("classic");
  const [ownedSkins, setOwnedSkins] = useState(["classic"]);
  const [dimension, setDimension] = useState(0);
  const [toast, setToast] = useState("Welcome to the trash dimension.");
  const [stage, setStage] = useState(0);
  const [floaters, setFloaters] = useState<{ id: number; x: number; y: number; value: number }[]>([]);

  const clickValue = 1 + dimension * 2 + Math.floor(upgrades.reduce((sum, item) => sum + item.level, 0) / 8);
  const perSecond = useMemo(
    () => upgrades.reduce((sum, item) => sum + item.level * item.baseRate, 0) * (1 + dimension * 0.2),
    [upgrades, dimension]
  );
  const progressGoal = [100, 1_000, 10_000, 75_000][Math.min(stage, 3)];
  const canPrestige = points >= 100_000;

  useEffect(() => {
    const saved = localStorage.getItem("jimothy-clicker-save");
    if (!saved) return;
    try {
      const state = JSON.parse(saved);
      setPoints(state.points ?? 0);
      setUpgrades(state.upgrades ?? freshUpgrades);
      setSkin(state.skin ?? "classic");
      setOwnedSkins(state.ownedSkins ?? ["classic"]);
      setDimension(state.dimension ?? 0);
      setStage(state.stage ?? 0);
    } catch { /* a new trash heap is fine */ }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPoints((value) => value + perSecond / 5);
    }, 200);
    return () => window.clearInterval(timer);
  }, [perSecond]);

  useEffect(() => {
    localStorage.setItem("jimothy-clicker-save", JSON.stringify({ points, upgrades, skin, ownedSkins, dimension, stage }));
  }, [points, upgrades, skin, ownedSkins, dimension, stage]);

  useEffect(() => {
    if (stage < 4 && points >= progressGoal) {
      setStage((value) => value + 1);
      setToast(["Ballard has noticed you.", "Seattle Salmon has joined the cause.", "The Space Needle is glowing green.", "Legendary trash status unlocked."][stage]);
    }
  }, [points, progressGoal, stage]);

  const tap = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPoints((value) => value + clickValue);
    const rect = event.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setFloaters((items) => [...items, { id, x: event.clientX - rect.left, y: event.clientY - rect.top, value: clickValue }]);
    window.setTimeout(() => setFloaters((items) => items.filter((item) => item.id !== id)), 700);
  };

  const buyUpgrade = (id: string) => {
    const item = upgrades.find((upgrade) => upgrade.id === id)!;
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

  const activeSkin = skins.find((item) => item.id === skin)!;

  return (
    <main>
      <Script
        src="https://quge5.com/88/tag.min.js"
        data-zone="262818"
        data-cfasync="false"
        strategy="afterInteractive"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seoSchema) }} />
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="Jimothy Clicker home"><span>JIMOTHY</span> CLICKER</a>
        <div className="nav-links"><a className="quiz-link" href="/quiz">WHICH JIMOTHY?</a><a href="#how">HOW TO PLAY</a><a href="#upgrades">UPGRADES</a><a href="#faq">FAQ</a></div>
        <button className="share" onClick={() => navigator.clipboard?.writeText(`I have ${format(points)} Trash Points in Jimothy Clicker 🗑️🦝`)}>↗ SHARE</button>
      </nav>

      <section className="game-shell" id="top">
        <aside className="sidebar left-panel">
          <div className="panel-title">TRASH EMPIRE <span>◈</span></div>
          <div className="stat-card"><small>TRASH POINTS</small><strong>{format(points)}</strong><em>+{format(perSecond)} / second</em></div>
          <div className="stat-card compact"><span>Dimension</span><strong>{dimension + 1}</strong><em>+{dimension * 20}% income</em></div>
          <div className="stage-card">
            <div><span>LEGEND TRACK</span><b>{Math.min(stage + 1, 4)} / 4</b></div>
            <div className="meter"><i style={{ width: `${Math.min(100, (points / progressGoal) * 100)}%` }} /></div>
            <p>{stage >= 4 ? "You are a Seattle legend." : `Next story beat at ${format(progressGoal)} TP`}</p>
          </div>
          <button className={`prestige ${canPrestige ? "ready" : ""}`} onClick={prestige}>
            <span>↻</span><div><b>RETURN TO THE<br />TRASH DIMENSION</b><small>{canPrestige ? "READY TO RETURN" : "NEEDS 100K TP"}</small></div>
          </button>
        </aside>

        <section className="play-area">
          <div className="night-sky"><div className="needle">▲</div><div className="moon" /></div>
          <div className="hud"><span>HOT JIMOTHY SUMMER</span><span>◉ BALLARD, SEATTLE</span></div>
          <div className="game-heading"><p>THE FREE VIRAL RACCOON CLICKER</p><h1>Jimothy Clicker – Play the Viral Raccoon Game Free</h1></div>
          <div className="speech"><b>{toast}</b><span>Tap Jimothy. Let the trash flow.</span></div>
          <button className={`jimothy-button skin-${skin}`} onClick={tap} aria-label="Tap Jimothy for Trash Points">
            <img src={skinImages[activeSkin.id]} alt={`${activeSkin.name} raccoon artwork`} />
            {floaters.map((floater) => <span key={floater.id} className="floater" style={{ left: floater.x, top: floater.y }}>+{floater.value}</span>)}
          </button>
          <div className="tap-prompt">TAP JIMOTHY <span>✦</span></div>
          <div className="ground"><span>🗑️</span><span>🍕</span><span>📰</span><span>🐟</span></div>
        </section>

        <aside className="sidebar upgrade-panel" id="upgrades">
          <div className="panel-title">AUTO DUMPSTERS <span>⌁</span></div>
          <p className="panel-copy">Hire the night shift. Every upgrade earns while you vibe.</p>
          <div className="upgrades">
            {upgrades.map((item) => {
              const cost = Math.floor(item.baseCost * Math.pow(1.18, item.level));
              return <button className="upgrade" key={item.id} onClick={() => buyUpgrade(item.id)}>
                <span className="upgrade-icon">{item.icon}</span><span className="upgrade-text"><b>{item.name}</b><small>{item.subtitle}</small><em>Lv. {item.level} · +{format(item.baseRate * (1 + dimension * .2))}/sec</em></span><span className="cost">{format(cost)}<small>TP</small></span>
              </button>;
            })}
          </div>
          <div className="tip"><span>✦</span> Pro tip: upgrade the bins before you log off. Jimothy never clocks out.</div>
        </aside>
      </section>

      <section className="collection" aria-labelledby="skins-heading">
        <div className="section-kicker">COLLECT THE LORE</div><h2 id="skins-heading">Every Seattle legend needs a look.</h2>
        <div className="skin-grid">{skins.map((item) => <button className={`skin-card ${skin === item.id ? "selected" : ""}`} key={item.id} onClick={() => chooseSkin(item)}><span className="skin-art"><img src={skinImages[item.id]} alt="" /></span><b>{item.name}</b><small>{item.note}</small><em>{ownedSkins.includes(item.id) ? (skin === item.id ? "EQUIPPED" : "OWNED") : `${format(item.cost)} TP`}</em></button>)}</div>
      </section>

      <section className="how-to" id="how" aria-labelledby="how-to-heading">
        <div className="section-kicker">HOW TO PLAY</div>
        <h2 id="how-to-heading">How to Play Jimothy Clicker</h2>
        <p className="section-intro">Jimothy Clicker is an easy-to-start idle game: tap the raccoon, turn Trash Points into upgrades, and build income that keeps rolling while you plan your next big haul.</p>
        <div className="guide">
          <article><span>01</span><h3>Tap Jimothy</h3><p>Click or tap Jimothy to earn Trash Points. Every point gets your raccoon empire closer to the next upgrade.</p></article>
          <article><span>02</span><h3>Buy Auto Dumpsters</h3><p>Spend points on Dumpster Dive, Seattle Salmon, and more. These upgrades generate passive income every second.</p></article>
          <article><span>03</span><h3>Return stronger</h3><p>Reach 100K Trash Points to return to the Trash Dimension. Your run resets, but passive income rises by 20% for the next one.</p></article>
        </div>
      </section>

      <section className="faq" id="faq" aria-labelledby="faq-heading">
        <div className="section-kicker">FAQ</div>
        <h2 id="faq-heading">Jimothy Clicker FAQ</h2>
        <div className="faq-grid">
          <details open><summary>What is Jimothy Clicker?</summary><p>It&apos;s a free, browser-based raccoon clicker game. Tap Jimothy, collect Trash Points, and grow a wildly efficient trash empire.</p></details>
          <details><summary>How do I earn points faster?</summary><p>Keep tapping to build your first balance, then purchase Auto Dumpster upgrades. Each upgrade adds passive Trash Points every second.</p></details>
          <details><summary>Is Jimothy Clicker free to play?</summary><p>Yes. You can play Jimothy Clicker in your browser for free, with no download required.</p></details>
          <details><summary>What does returning to the Trash Dimension do?</summary><p>When you have 100K Trash Points, you can reset your current run for a permanent 20% passive-income bonus in the next dimension.</p></details>
          <details><summary>Do my game progress and skins save?</summary><p>Yes. Your points, upgrades, unlocked skins, and dimension are saved automatically in this browser on your device.</p></details>
          <details><summary>What are skins for?</summary><p>Skins let you give Jimothy a new look. Unlock them with Trash Points, then equip any skin you own from the collection.</p></details>
        </div>
      </section>

      <footer><span>JIMOTHY CLICKER</span><p>A fan-made Seattle meme clicker. Please admire wildlife from a respectful distance. Background photo: <a href="https://unsplash.com/photos/space-needle-tower-during-night-time-q35IgQ7lqkg" target="_blank" rel="noreferrer">Seattle night</a>.</p><a href="#top">BACK TO THE BINS ↑</a></footer>
    </main>
  );
}
