import { m as require_react, t as require_jsx_runtime, v as __toESM } from "../index.js";
//#region app/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var templates = [
	{
		id: "party",
		name: "Party Jimothy",
		mood: "celebration mode",
		image: "/assets/jimothy-party.png",
		color: "#ff724c"
	},
	{
		id: "headphones",
		name: "Lo-fi Jimothy",
		mood: "unbothered",
		image: "/assets/jimothy-headphones.png",
		color: "#8d6bff"
	},
	{
		id: "bowtie",
		name: "Formal Jimothy",
		mood: "respectfully feral",
		image: "/assets/jimothy-bowtie.png",
		color: "#ef476f"
	},
	{
		id: "crown",
		name: "King Jimothy",
		mood: "royal bin energy",
		image: "/assets/jimothy-crown.png",
		color: "#f3b544"
	},
	{
		id: "sunglasses",
		name: "Cool Jimothy",
		mood: "built different",
		image: "/assets/jimothy-sunglasses.png",
		color: "#2dcfb4"
	}
];
var presets = [
	["WHAT AM I", "LOOKING AT?"],
	["HOT JIMOTHY", "SUMMER"],
	["BUILT", "DIFFERENT"],
	["KING OF", "THE TRASH"],
	["NO NECK", "NO PROBLEM"],
	["ME ENTERING", "MONDAY MORNING"]
];
var sizes = {
	square: {
		label: "1:1",
		width: 1080,
		height: 1080
	},
	portrait: {
		label: "4:5",
		width: 1080,
		height: 1350
	},
	story: {
		label: "9:16",
		width: 1080,
		height: 1920
	}
};
var backgrounds = [
	"#f4efdc",
	"#b8ef50",
	"#ff7957",
	"#8d6bff",
	"#11202a"
];
function makeShareUrl(template, top, bottom, size, background) {
	const url = new URL(window.location.href);
	url.search = new URLSearchParams({
		template,
		top,
		bottom,
		size,
		background
	}).toString();
	return url.toString();
}
function Home() {
	const [templateId, setTemplateId] = (0, import_react.useState)("party");
	const [topText, setTopText] = (0, import_react.useState)("WHAT AM I");
	const [bottomText, setBottomText] = (0, import_react.useState)("LOOKING AT?");
	const [size, setSize] = (0, import_react.useState)("square");
	const [background, setBackground] = (0, import_react.useState)(backgrounds[0]);
	const [notice, setNotice] = (0, import_react.useState)("Pick a Jimothy, make your point.");
	const canvasRef = (0, import_react.useRef)(null);
	const template = templates.find((item) => item.id === templateId) ?? templates[0];
	(0, import_react.useEffect)(() => {
		const params = new URLSearchParams(window.location.search);
		const sharedTemplate = params.get("template");
		const sharedSize = params.get("size");
		if (sharedTemplate && templates.some((item) => item.id === sharedTemplate)) setTemplateId(sharedTemplate);
		if (params.get("top")) setTopText(params.get("top").slice(0, 42));
		if (params.get("bottom")) setBottomText(params.get("bottom").slice(0, 42));
		if (sharedSize && sizes[sharedSize]) setSize(sharedSize);
		if (params.get("background") && /^#[0-9a-f]{6}$/i.test(params.get("background"))) setBackground(params.get("background"));
	}, []);
	const draw = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const { width, height } = sizes[size];
		const context = canvas.getContext("2d");
		if (!context) return;
		canvas.width = width;
		canvas.height = height;
		context.fillStyle = background;
		context.fillRect(0, 0, width, height);
		context.globalAlpha = .13;
		context.fillStyle = background === "#11202a" ? "#ffffff" : "#0c2026";
		for (let x = -height; x < width + height; x += 54) context.fillRect(x, 0, 18, height);
		context.globalAlpha = 1;
		const image = new Image();
		image.src = template.image;
		image.onload = () => {
			const padding = size === "story" ? 70 : 46;
			const typeScale = size === "story" ? 78 : size === "portrait" ? 68 : 60;
			const maxWidth = width - padding * 2;
			const artAreaTop = size === "story" ? height * .22 : height * .18;
			const artAreaHeight = height - artAreaTop - (size === "story" ? 210 : 160);
			const ratio = Math.min(maxWidth / image.width, artAreaHeight / image.height);
			const artWidth = image.width * ratio;
			const artHeight = image.height * ratio;
			context.drawImage(image, (width - artWidth) / 2, artAreaTop + (artAreaHeight - artHeight) / 2, artWidth, artHeight);
			const text = (value, y) => {
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
				context.lineWidth = Math.max(7, fontSize * .13);
				context.strokeStyle = "#061114";
				context.fillStyle = "#fffdf2";
				context.strokeText(safe, width / 2, y);
				context.fillText(safe, width / 2, y);
			};
			text(topText, size === "story" ? 120 : 92);
			text(bottomText, height - (size === "story" ? 105 : 78));
			context.globalAlpha = .8;
			context.font = "500 20px ui-monospace, monospace";
			context.textAlign = "right";
			context.fillStyle = "#061114";
			context.fillText("JIMOTHY.THE.RACCOON", width - 32, height - 25);
			context.globalAlpha = 1;
		};
	}, [
		background,
		bottomText,
		size,
		template.image,
		topText
	]);
	(0, import_react.useEffect)(() => {
		draw();
	}, [draw]);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "topbar",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					className: "brand",
					href: "#maker",
					"aria-label": "Jimothy the Raccoon Meme Generator home",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "JIMOTHY" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "THE RACCOON" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "nav-links",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#templates",
							children: "TEMPLATES"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#how",
							children: "HOW IT WORKS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/quiz",
							children: "WHICH JIMOTHY?"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "share-link",
					onClick: copyShareLink,
					children: "COPY LINK"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "hero",
			id: "maker",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "THE UNOFFICIAL MEME WORKSHOP"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						"Jimothy the Raccoon",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "Meme Generator" })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "intro",
						children: "Make a proper Jimothy meme in seconds. Choose a mood, add your caption, and send it into the wild."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hero-tags",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "5 original templates" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Free PNG export" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No AI required" })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-art",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
					"TRASH",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"TALK"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/assets/jimothy-crown.png",
					alt: ""
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "maker-section",
			"aria-labelledby": "maker-title",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-heading",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "MAKE ONE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "maker-title",
						children: "Give Jimothy a line."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: notice })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "maker-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "controls",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							id: "templates",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "1. Pick a Jimothy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "template-grid",
								children: templates.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: `template ${item.id === templateId ? "selected" : ""}`,
									onClick: () => {
										setTemplateId(item.id);
										setNotice(`${item.name} is on the case.`);
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { backgroundColor: item.color },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: item.image,
												alt: ""
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.name }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.mood })
									]
								}, item.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "2. Write the bit" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["TOP TEXT", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: topText,
								maxLength: 42,
								onChange: (event) => setTopText(event.target.value),
								placeholder: "WHAT AM I"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["BOTTOM TEXT", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: bottomText,
								maxLength: 42,
								onChange: (event) => setBottomText(event.target.value),
								placeholder: "LOOKING AT?"
							})] })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "3. Choose the frame" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ratio-row",
								children: Object.keys(sizes).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: size === key ? "active" : "",
									onClick: () => setSize(key),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `ratio-icon ${key}` }), sizes[key].label]
								}, key))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "color-row",
								children: backgrounds.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: background === color ? "active" : "",
									style: { background: color },
									onClick: () => setBackground(color),
									"aria-label": `Use ${color} background`
								}, color))
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "Need a little chaos?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "preset-row",
							children: presets.map(([top, bottom]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setTopText(top);
									setBottomText(bottom);
								},
								children: [
									top,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									bottom
								]
							}, `${top}-${bottom}`))
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "preview-panel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `canvas-wrap ${size}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
							ref: canvasRef,
							"aria-label": "Your Jimothy meme preview"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "export-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "download",
							onClick: download,
							children: ["DOWNLOAD PNG ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↓" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "secondary",
							onClick: copyShareLink,
							children: "COPY SHARE LINK"
						})]
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "meme-wall",
			id: "how",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "JIMOTHY LORE, READY-TO-USE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Five moods. Infinite garbage." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Every template arrives with a clean transparent background, so the only thing between you and a legendary post is a good caption." })
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "wall-cards",
				children: templates.slice(1, 4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					style: { "--accent": item.color },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.image,
							alt: `${item.name} transparent raccoon template`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.mood })
					]
				}, item.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "how-to",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "NO ACCOUNT. NO FUSS."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Three steps to trash greatness." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "steps",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Pick your Jimothy" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Choose the version that matches the energy. Crowned, formal, cool, or fully party-ready." })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Caption the moment" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Use your own words or start with a classic Jimothy preset." })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "03" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Post it everywhere" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Download a crisp PNG or copy a link that preserves your exact masterpiece." })
						] })
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: "brand",
				href: "#maker",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "JIMOTHY" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "THE RACCOON" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A fan-made meme tool. Please admire wildlife from a respectful distance." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/quiz",
				children: "TAKE THE JIMOTHY QUIZ →"
			})
		] })
	] });
}
//#endregion
export { Home as default };
