import JimothyWorldNav from "../jimothy-world-nav";

export default function ResultsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><JimothyWorldNav active="quiz" />{children}</>;
}
