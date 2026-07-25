"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import JimothyWorldNav from "./jimothy-world-nav";

type Template = {
  id: string;
  name: string;
  mood: string;
  image: string;
  color: string;
};

const templates: Template[] = [
  { id: "party", name: "Party Jimothy", mood: "celebration mode", image: "/assets/jimothy-party.png", color: "#ff724c" },
  { id: "headphones", name: "Lo-fi Jimothy", mood: "unbothered", image: "/assets/jimothy-headphones.png", color: "#8d6bff" },
  { id: "bowtie", name: "Formal Jimothy", mood: "respectfully feral", image: "/assets/jimothy-bowtie.png", color: "#ef476f" },
  { id: "crown", name: "King Jimothy", mood: "royal bin energy", image: "/assets/jimothy-crown.png", color: "#f3b544" },
  { id: "sunglasses", name: "Cool Jimothy", mood: "built different", image: "/assets/jimothy-sunglasses.png", color: "#2dcfb4" },
];

const presets = [
  ["WHAT AM I", "LOOKING AT?"],
  ["HOT JIMOTHY", "SUMMER"],
  ["BUILT", "DIFFERENT"],
  ["KING OF", "THE TRASH"],
  ["NO NECK", "NO PROBLEM"],
  ["ME ENTERING", "MONDAY MORNING"],
];

const sizes = {
  square: { label: "1:1", width: 1080, height: 1080 },
  portrait: { label: "4:5", width: 1080, height: 1350 },
  story: { label: "9:16", width: 1080, height: 1920 },
} as const;

type SizeKey = keyof typeof sizes;

const backgrounds = ["#f4efdc", "#b8ef50", "#ff7957", "#8d6bff", "#11202a"];

function makeShareUrl(template: string, top: string, bottom: string, size: SizeKey, background: string) {
  const url = new URL(window.location.href);
  url.search = new URLSearchParams({ template, top, bottom, size, background }).toString();
  return url.toString();
}

export default function Home() {
  const [templateId, setTemplateId] = useState("party");
  const [topText, setTopText] = useState("WHAT AM I");
  const [bottomText, setBottomText] = useState("LOOKING AT?");
  const [size, setSize] = useState<SizeKey>("square");
  const [background, setBackground] = useState(backgrounds[0]);
  const [notice, setNotice] = useState("Pick a Jimothy, make your point.");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const template = templates.find((item) => item.id === templateId) ?? templates[0];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedTemplate = params.get("template");
    const sharedSize = params.get("size") as SizeKey | null;
    if (sharedTemplate && templates.some((item) => item.id === sharedTemplate)) setTemplateId(sharedTemplate);
    if (params.get("top")) setTopText(params.get("top")!.slice(0, 42));
    if (params.get("bottom")) setBottomText(params.get("bottom")!.slice(0, 42));
    if (sharedSize && sizes[sharedSize]) setSize(sharedSize);
    if (params.get("background") && /^#[0-9a-f]{6}$/i.test(params.get("background")!)) setBackground(params.get("background")!);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = sizes[size];
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = width;
    canvas.height = height;

    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    context.globalAlpha = 0.13;
    context.fillStyle = background === "#11202a" ? "#ffffff" : "#0c2026";
    for (let x = -height; x < width + height; x += 54) context.fillRect(x, 0, 18, height);
    context.globalAlpha = 1;

    const image = new Image();
    image.src = template.image;
    image.onload = () => {
      const padding = size === "story" ? 70 : 46;
      const typeScale = size === "story" ? 78 : size === "portrait" ? 68 : 60;
      const maxWidth = width - padding * 2;
      const artAreaTop = size === "story" ? height * 0.22 : height * 0.18;
      const artAreaHeight = height - artAreaTop - (size === "story" ? 210 : 160);
      const ratio = Math.min(maxWidth / image.width, artAreaHeight / image.height);
      const artWidth = image.width * ratio;
      const artHeight = image.height * ratio;
      context.drawImage(image, (width - artWidth) / 2, artAreaTop + (artAreaHeight - artHeight) / 2, artWidth, artHeight);

      const text = (value: string, y: number) => {
        const safe = value.toUpperCase() || " ";
        let fontSize = typeScale;
        context.font = `900 ${fontSize}px Impact, Arial Black, sans-serif`;
        while (context.measureText(safe).width > maxWidth && fontSize > 28) {
          fontSize -= 2;
          context.font = `900 ${fontSize}px Impact, Arial Black, sans-serif`;
        }
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineJoin = "round";
        context.lineWidth = Math.max(7, fontSize * 0.13);
        context.strokeStyle = "#061114";
        context.fillStyle = "#fffdf2";
        context.strokeText(safe, width / 2, y);
        context.fillText(safe, width / 2, y);
      };
      text(topText, size === "story" ? 120 : 92);
      text(bottomText, height - (size === "story" ? 105 : 78));

      context.globalAlpha = 0.8;
      context.font = "500 20px ui-monospace, monospace";
      context.textAlign = "right";
      context.fillStyle = "#061114";
      context.fillText("JIMOTHY.THE.RACCOON", width - 32, height - 25);
      context.globalAlpha = 1;
    };
  }, [background, bottomText, size, template.image, topText]);

  useEffect(() => { draw(); }, [draw]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const anchor = document.createElement("a");
    anchor.download = `jimothy-${template.id}-meme.png`;
    anchor.href = canvas.toDataURL("image/png");
    anchor.click();
    setNotice("Your meme is ready for the group chat.");
  };

  const copyShareLink = async () => {
    const link = makeShareUrl(templateId, topText, bottomText, size, background);
    try {
      await navigator.clipboard.writeText(link);
      setNotice("Share link copied — the lore travels.");
    } catch {
      window.prompt("Copy this share link:", link);
    }
  };

  return (
    <main>
      <nav className="topbar">
        <a className="brand" href="#maker" aria-label="Jimothy the Raccoon Meme Generator home"><span>JIMOTHY</span><small>THE RACCOON</small></a>
        <div className="nav-links"><a href="#templates">TEMPLATES</a><a href="#how">HOW IT WORKS</a><a href="/who-is-jimothy">JIMOTHY LORE</a><a href="/quiz">WHICH JIMOTHY?</a></div>
        <button className="share-link" onClick={copyShareLink}>COPY LINK</button>
      </nav>

      <JimothyWorldNav active="meme" />

      <section className="hero" id="maker">
        <div className="hero-copy">
          <p className="eyebrow">THE UNOFFICIAL MEME WORKSHOP</p>
          <h1>Jimothy the Raccoon<br /><i>Meme Generator</i></h1>
          <p className="intro">Make a proper Jimothy meme in seconds. Choose a mood, add your caption, and send it into the wild.</p>
          <div className="hero-tags"><span>5 original templates</span><span>Free PNG export</span><span>No AI required</span></div>
        </div>
        <div className="hero-art" aria-hidden="true"><b>TRASH<br />TALK</b><img src="/assets/jimothy-crown.png" alt="" /></div>
      </section>

      <section className="maker-section" aria-labelledby="maker-title">
        <div className="section-heading"><p className="eyebrow">MAKE ONE</p><h2 id="maker-title">Give Jimothy a line.</h2><span>{notice}</span></div>
        <div className="maker-grid">
          <div className="controls">
            <fieldset id="templates"><legend>1. Pick a Jimothy</legend><div className="template-grid">
              {templates.map((item) => <button key={item.id} className={`template ${item.id === templateId ? "selected" : ""}`} onClick={() => { setTemplateId(item.id); setNotice(`${item.name} is on the case.`); }}><span style={{ backgroundColor: item.color }}><img src={item.image} alt="" /></span><b>{item.name}</b><small>{item.mood}</small></button>)}
            </div></fieldset>
            <fieldset><legend>2. Write the bit</legend><label>TOP TEXT<input value={topText} maxLength={42} onChange={(event) => setTopText(event.target.value)} placeholder="WHAT AM I" /></label><label>BOTTOM TEXT<input value={bottomText} maxLength={42} onChange={(event) => setBottomText(event.target.value)} placeholder="LOOKING AT?" /></label></fieldset>
            <fieldset><legend>3. Choose the frame</legend><div className="ratio-row">{(Object.keys(sizes) as SizeKey[]).map((key) => <button key={key} className={size === key ? "active" : ""} onClick={() => setSize(key)}><i className={`ratio-icon ${key}`} />{sizes[key].label}</button>)}</div><div className="color-row">{backgrounds.map((color) => <button key={color} className={background === color ? "active" : ""} style={{ background: color }} onClick={() => setBackground(color)} aria-label={`Use ${color} background`} />)}</div></fieldset>
            <fieldset><legend>Need a little chaos?</legend><div className="preset-row">{presets.map(([top, bottom]) => <button key={`${top}-${bottom}`} onClick={() => { setTopText(top); setBottomText(bottom); }}>{top}<br />{bottom}</button>)}</div></fieldset>
          </div>
          <div className="preview-panel"><div className={`canvas-wrap ${size}`}><canvas ref={canvasRef} aria-label="Your Jimothy meme preview" /></div><div className="export-row"><button className="download" onClick={download}>DOWNLOAD PNG <span>↓</span></button><button className="secondary" onClick={copyShareLink}>COPY SHARE LINK</button></div></div>
        </div>
      </section>

      <section className="meme-wall" id="how"><div><p className="eyebrow">JIMOTHY LORE, READY-TO-USE</p><h2>Five moods. Infinite garbage.</h2><p>Every template arrives with a clean transparent background, so the only thing between you and a legendary post is a good caption.</p></div><div className="wall-cards">{templates.slice(1, 4).map((item) => <article key={item.id} style={{ "--accent": item.color } as CSSProperties}><img src={item.image} alt={`${item.name} transparent raccoon template`} /><b>{item.name}</b><span>{item.mood}</span></article>)}</div></section>

      <section className="how-to"><p className="eyebrow">NO ACCOUNT. NO FUSS.</p><h2>Three steps to trash greatness.</h2><div className="steps"><article><span>01</span><h3>Pick your Jimothy</h3><p>Choose the version that matches the energy. Crowned, formal, cool, or fully party-ready.</p></article><article><span>02</span><h3>Caption the moment</h3><p>Use your own words or start with a classic Jimothy preset.</p></article><article><span>03</span><h3>Post it everywhere</h3><p>Download a crisp PNG or copy a link that preserves your exact masterpiece.</p></article></div></section>

      <footer><a className="brand" href="#maker"><span>JIMOTHY</span><small>THE RACCOON</small></a><p>A fan-made meme tool. Please admire wildlife from a respectful distance.</p><a href="/quiz">TAKE THE JIMOTHY QUIZ →</a></footer>
    </main>
  );
}
