type JimothyWorldNavProps = {
  active: "meme" | "quiz" | "clicker";
};

const destinations = [
  { id: "meme", href: "/", kicker: "CREATE · SHARE · REPEAT", title: "Meme Maker", description: "Give Jimothy a line and send it to the group chat.", number: "01" },
  { id: "quiz", href: "/quiz", kicker: "7 QUESTIONS · 1 TRUE FORM", title: "Which Jimothy?", description: "Find out which version of the raccoon you really are.", number: "02" },
  { id: "clicker", href: "/clicker", kicker: "TAP · UPGRADE · ASCEND", title: "Jimothy Clicker", description: "Build a trash empire, one tap at a time.", number: "03" },
] as const;

export default function JimothyWorldNav({ active }: JimothyWorldNavProps) {
  return (
    <section className="world-nav" aria-labelledby="world-nav-heading">
      <div className="world-nav-intro"><p>JIMOTHY WORLD</p><h2 id="world-nav-heading">Pick your chaos.</h2><span>TOOLS &amp; GAMES</span></div>
      <div className="world-nav-destinations">
        {destinations.map((destination) => {
          const isActive = destination.id === active;
          return <a className={`world-destination ${destination.id} ${isActive ? "active" : ""}`} href={destination.href} key={destination.id} aria-current={isActive ? "page" : undefined}>
            <span className="world-number">{destination.number}</span>
            <span className="world-destination-copy"><small>{isActive ? "YOU ARE HERE" : destination.kicker}</small><b>{destination.title}</b><em>{isActive ? "You are already making excellent choices." : destination.description}</em></span>
            <i aria-hidden="true">{isActive ? "✓" : "→"}</i>
          </a>;
        })}
      </div>
    </section>
  );
}
