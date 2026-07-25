import { m as require_react, t as require_jsx_runtime, v as __toESM } from "../index.js";
//#region app/results/[slug]/result-client.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var sizes = {
	landscape: [
		1200,
		630,
		"Landscape"
	],
	portrait: [
		1080,
		1350,
		"Portrait"
	],
	story: [
		1080,
		1920,
		"Story"
	]
};
function ResultClient({ result, moreResults }) {
	const [format, setFormat] = (0, import_react.useState)("landscape");
	const [notice, setNotice] = (0, import_react.useState)("");
	const url = typeof window === "undefined" ? `/results/${result.slug}` : `${window.location.origin}/results/${result.slug}`;
	const text = `I got ${result.name}. ${result.shareLine}`;
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setNotice("Result link copied.");
		} catch {
			window.prompt("Copy this link:", url);
		}
	};
	const share = async () => {
		try {
			if (navigator.share) await navigator.share({
				title: "Which Jimothy Are You?",
				text,
				url
			});
			else throw new Error("no share");
		} catch {
			try {
				await navigator.clipboard.writeText(`${text} ${url}`);
				setNotice("Share text copied — send it into the group chat.");
			} catch {
				window.prompt("Copy this share text:", `${text} ${url}`);
			}
		}
	};
	const download = () => {
		const [w, h] = sizes[format];
		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const vertical = h > w;
		const grad = ctx.createLinearGradient(0, 0, w, h);
		grad.addColorStop(0, "#071923");
		grad.addColorStop(1, result.tone);
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "rgba(255,255,255,.45)";
		ctx.lineWidth = 3;
		ctx.strokeRect(28, 28, w - 56, h - 56);
		ctx.fillStyle = "#d7ff88";
		ctx.font = `700 ${vertical ? 32 : 25}px Arial`;
		ctx.fillText("WHICH JIMOTHY ARE YOU?", w * .08, h * .11);
		ctx.fillStyle = "#fff8e7";
		ctx.font = `900 ${vertical ? 92 : 76}px Arial`;
		wrap(ctx, result.name, vertical ? w * .84 : w * .44).forEach((line, i) => ctx.fillText(line, w * .08, h * (.22 + i * (vertical ? .065 : .105))));
		ctx.font = `600 ${vertical ? 27 : 22}px Arial`;
		wrap(ctx, result.shareLine, vertical ? w * .75 : w * .4).slice(0, 2).forEach((line, i) => ctx.fillText(line, w * .08, h * (.48 + i * .045)));
		const image = new Image();
		image.src = result.image;
		image.onload = () => {
			ctx.drawImage(image, vertical ? w * .08 : w * .51, vertical ? h * .56 : h * .1, vertical ? w * .84 : w * .44, vertical ? h * .3 : h * .73);
			ctx.fillStyle = "#071923";
			ctx.font = `700 ${vertical ? 21 : 18}px Arial`;
			ctx.fillText("Which Jimothy Are You?  •  jimothy.click", w * .08, h * .94);
			const link = document.createElement("a");
			link.download = `${result.slug}-${w}x${h}.png`;
			link.href = canvas.toDataURL("image/png");
			link.click();
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "quiz-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "quiz-nav",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					className: "quiz-brand",
					href: "/",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "JIMOTHY" }), " WORLD"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/quiz",
					children: "TAKE THE QUIZ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					children: "MEME MAKER"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "result-page",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "result-intro",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "YOUR TRUE JIMOTHY FORM"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
								"You Are",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: result.name })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "result-summary",
								children: result.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "keyword-row",
								children: result.keywords.map((word) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: word }, word))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "result-card",
						style: { "--tone": result.tone },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-stamp",
								children: [
									"JIMOTHY",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"CERTIFIED"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "WHICH JIMOTHY ARE YOU?" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: result.image,
								alt: result.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: result.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: result.shareLine }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
								className: "card-credit",
								children: "Which Jimothy Are You? · jimothy.click"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "result-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "primary-quiz",
								onClick: share,
								children: ["Share Your Jimothy ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "download-button",
								onClick: download,
								children: ["Download Result ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "download-button",
								onClick: copy,
								children: ["Copy Link ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "format-choice",
								children: Object.keys(sizes).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: format === item ? "active" : "",
									onClick: () => setFormat(item),
									children: [sizes[item][2], /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										sizes[item][0],
										" × ",
										sizes[item][1]
									] })]
								}, item))
							})
						]
					}),
					notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "share-notice",
						role: "status",
						children: notice
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "result-reading",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "THE OFFICIAL READING"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["Life as ", result.name] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: result.description }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "detail-grid",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "REPRESENTATIVE SNACK" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: result.snack })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "OFFICIAL CATCHPHRASE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
									"“",
									result.catchphrase,
									"”"
								] })] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "more-jimothy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "KEEP THE CHAOS GOING"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "What did your friends get?" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "more-grid",
								children: moreResults.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `/results/${item.slug}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.eyebrow }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.name }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.shareLine }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "See result →" })
									]
								}, item.slug))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "retake result-retake",
						href: "/quiz",
						children: "← Retake the Quiz"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "quiz-footer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "quiz-brand",
						href: "/",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "JIMOTHY" }), " WORLD"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A very serious raccoon institution. Please admire wildlife from a respectful distance." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/quiz",
						children: "Which Jimothy Are You? →"
					})
				]
			})
		]
	});
}
function wrap(ctx, text, maxWidth) {
	const words = text.split(" ");
	const lines = [];
	let line = "";
	words.forEach((word) => {
		const candidate = `${line} ${word}`.trim();
		if (ctx.measureText(candidate).width > maxWidth && line) {
			lines.push(line);
			line = word;
		} else line = candidate;
	});
	lines.push(line);
	return lines;
}
//#endregion
export { ResultClient as default };
