import { _ as stripBasePath, a as ReadonlyURLSearchParams, c as notifyAppRouterTransitionStart, d as toSameOriginAppPath, f as assertSafeNavigationUrl, g as VINEXT_PARAMS_HEADER, h as VINEXT_MOUNTED_SLOTS_HEADER, l as isHashOnlyBrowserUrlChange, m as require_react, o as createRscRequestHeaders, p as AppElementsWire, s as createRscRequestUrl, t as require_jsx_runtime, u as toBrowserNavigationHref, v as __toESM } from "../index.js";
//#region node_modules/vinext/dist/shims/navigation.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var _SERVER_INSERTED_HTML_CTX_KEY = Symbol.for("vinext.serverInsertedHTMLContext");
function getServerInsertedHTMLContext() {
	if (typeof import_react.createContext !== "function") return null;
	const globalState = globalThis;
	if (!globalState[_SERVER_INSERTED_HTML_CTX_KEY]) globalState[_SERVER_INSERTED_HTML_CTX_KEY] = import_react.createContext(null);
	return globalState[_SERVER_INSERTED_HTML_CTX_KEY] ?? null;
}
getServerInsertedHTMLContext();
var isServer = typeof window === "undefined";
function getCurrentInterceptionContext() {
	if (isServer) return null;
	return stripBasePath(window.location.pathname, "");
}
/** Get or create the shared in-memory RSC prefetch cache on window. */
function getPrefetchCache() {
	if (isServer) return /* @__PURE__ */ new Map();
	if (!window.__VINEXT_RSC_PREFETCH_CACHE__) window.__VINEXT_RSC_PREFETCH_CACHE__ = /* @__PURE__ */ new Map();
	return window.__VINEXT_RSC_PREFETCH_CACHE__;
}
/**
* Get or create the shared set of already-prefetched RSC URLs on window.
* Keyed by interception-aware cache key so distinct source routes do not alias.
*/
function getPrefetchedUrls() {
	if (isServer) return /* @__PURE__ */ new Set();
	if (!window.__VINEXT_RSC_PREFETCHED_URLS__) window.__VINEXT_RSC_PREFETCHED_URLS__ = /* @__PURE__ */ new Set();
	return window.__VINEXT_RSC_PREFETCHED_URLS__;
}
/**
* Evict prefetch cache entries if at capacity.
* First sweeps expired entries, then falls back to FIFO eviction.
*/
function evictPrefetchCacheIfNeeded() {
	const cache = getPrefetchCache();
	if (cache.size < 50) return;
	const now = Date.now();
	const prefetched = getPrefetchedUrls();
	for (const [key, entry] of cache) if (now - entry.timestamp >= 3e4) {
		cache.delete(key);
		prefetched.delete(key);
	}
	while (cache.size >= 50) {
		const oldest = cache.keys().next().value;
		if (oldest !== void 0) {
			cache.delete(oldest);
			prefetched.delete(oldest);
		} else break;
	}
}
/**
* Snapshot an RSC response to an ArrayBuffer for caching and replay.
* Consumes the response body and stores it with content-type and URL metadata.
*/
async function snapshotRscResponse(response) {
	return {
		buffer: await response.arrayBuffer(),
		contentType: response.headers.get("content-type") ?? "text/x-component",
		mountedSlotsHeader: response.headers.get(VINEXT_MOUNTED_SLOTS_HEADER),
		paramsHeader: response.headers.get(VINEXT_PARAMS_HEADER),
		url: response.url
	};
}
/**
* Prefetch an RSC response and snapshot it for later consumption.
* Stores the in-flight promise so immediate clicks can await it instead
* of firing a duplicate fetch.
* Enforces a maximum cache size to prevent unbounded memory growth on
* link-heavy pages.
*/
function prefetchRscResponse(rscUrl, fetchPromise, interceptionContext = null, mountedSlotsHeader = null) {
	const cacheKey = AppElementsWire.encodeCacheKey(rscUrl, interceptionContext);
	const cache = getPrefetchCache();
	const prefetched = getPrefetchedUrls();
	const entry = {
		outcome: "pending",
		timestamp: Date.now()
	};
	entry.pending = fetchPromise.then(async (response) => {
		if (response.ok) entry.snapshot = {
			...await snapshotRscResponse(response),
			mountedSlotsHeader
		};
		else {
			prefetched.delete(cacheKey);
			cache.delete(cacheKey);
		}
	}).catch(() => {
		prefetched.delete(cacheKey);
		cache.delete(cacheKey);
	}).finally(() => {
		entry.pending = void 0;
		if (entry.snapshot) entry.outcome = "cache-seeded";
	});
	cache.set(cacheKey, entry);
	evictPrefetchCacheIfNeeded();
}
var _CLIENT_NAV_STATE_KEY = Symbol.for("vinext.clientNavigationState");
var _MOUNTED_SLOTS_HEADER_KEY = Symbol.for("vinext.mountedSlotsHeader");
function getMountedSlotsHeader() {
	if (isServer) return null;
	return window[_MOUNTED_SLOTS_HEADER_KEY] ?? null;
}
function getClientNavigationState() {
	if (isServer) return null;
	const globalState = window;
	globalState[_CLIENT_NAV_STATE_KEY] ??= {
		listeners: /* @__PURE__ */ new Set(),
		cachedSearch: window.location.search,
		cachedReadonlySearchParams: new ReadonlyURLSearchParams(window.location.search),
		cachedPathname: stripBasePath(window.location.pathname, ""),
		clientParams: {},
		clientParamsJson: "{}",
		pendingClientParams: null,
		pendingClientParamsJson: null,
		pendingPathname: null,
		pendingPathnameNavId: null,
		originalPushState: window.history.pushState.bind(window.history),
		originalReplaceState: window.history.replaceState.bind(window.history),
		patchInstalled: false,
		hasPendingNavigationUpdate: false,
		suppressUrlNotifyCount: 0,
		navigationSnapshotActiveCount: 0
	};
	return globalState[_CLIENT_NAV_STATE_KEY];
}
function notifyNavigationListeners() {
	const state = getClientNavigationState();
	if (!state) return;
	for (const fn of state.listeners) fn();
}
function syncCommittedUrlStateFromLocation() {
	const state = getClientNavigationState();
	if (!state) return false;
	let changed = false;
	const pathname = stripBasePath(window.location.pathname, "");
	if (pathname !== state.cachedPathname) {
		state.cachedPathname = pathname;
		changed = true;
	}
	const search = window.location.search;
	if (search !== state.cachedSearch) {
		state.cachedSearch = search;
		state.cachedReadonlySearchParams = new ReadonlyURLSearchParams(search);
		changed = true;
	}
	return changed;
}
/**
* Check if a href is an external URL (any URL scheme per RFC 3986, or protocol-relative).
*/
function isExternalUrl(href) {
	return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//");
}
/**
* Check if a href is only a hash change relative to the current URL.
*/
function isHashOnlyChange(href) {
	if (typeof window === "undefined") return false;
	if (href.startsWith("#")) return true;
	return isHashOnlyBrowserUrlChange(href, window.location.href, "");
}
/**
* Scroll to a hash target element, or to the top if no hash.
*/
function scrollToHash(hash) {
	if (!hash || hash === "#") {
		window.scrollTo(0, 0);
		return;
	}
	const id = hash.slice(1);
	const element = document.getElementById(id);
	if (element) element.scrollIntoView({ behavior: "auto" });
}
function withSuppressedUrlNotifications(fn) {
	const state = getClientNavigationState();
	if (!state) return fn();
	state.suppressUrlNotifyCount += 1;
	try {
		return fn();
	} finally {
		state.suppressUrlNotifyCount -= 1;
	}
}
/**
* Commit pending client navigation state to committed snapshots.
*
* navId is optional: callers that don't own pendingPathname (for example,
* superseded pre-paint cleanup) may pass undefined to flush URL/params state
* without clearing pendingPathname owned by the active navigation. Such callers
* must opt in explicitly if they also own an activated render snapshot.
*/
function commitClientNavigationState(navId, options) {
	if (isServer) return;
	const state = getClientNavigationState();
	if (!state) return;
	if ((navId !== void 0 || options?.releaseSnapshot === true) && state.navigationSnapshotActiveCount > 0) state.navigationSnapshotActiveCount -= 1;
	const urlChanged = syncCommittedUrlStateFromLocation();
	if (state.pendingClientParams !== null && state.pendingClientParamsJson !== null) {
		state.clientParams = state.pendingClientParams;
		state.clientParamsJson = state.pendingClientParamsJson;
		state.pendingClientParams = null;
		state.pendingClientParamsJson = null;
	}
	if (state.pendingPathnameNavId === null || navId !== void 0 && state.pendingPathnameNavId === navId) {
		state.pendingPathname = null;
		state.pendingPathnameNavId = null;
	}
	const shouldNotify = urlChanged || state.hasPendingNavigationUpdate;
	state.hasPendingNavigationUpdate = false;
	if (shouldNotify) notifyNavigationListeners();
}
function pushHistoryStateWithoutNotify(data, unused, url) {
	withSuppressedUrlNotifications(() => {
		getClientNavigationState()?.originalPushState.call(window.history, data, unused, url);
	});
}
function replaceHistoryStateWithoutNotify(data, unused, url) {
	withSuppressedUrlNotifications(() => {
		getClientNavigationState()?.originalReplaceState.call(window.history, data, unused, url);
	});
}
/**
* Save the current scroll position into the current history state.
* Called before every navigation to enable scroll restoration on back/forward.
*
* Uses replaceHistoryStateWithoutNotify to avoid triggering the patched
* history.replaceState interception (which would cause spurious re-renders).
*/
function saveScrollPosition() {
	replaceHistoryStateWithoutNotify({
		...window.history.state ?? {},
		__vinext_scrollX: window.scrollX,
		__vinext_scrollY: window.scrollY
	}, "");
}
/**
* Restore scroll position from a history state object (used on popstate).
*
* When an RSC navigation is in flight (back/forward triggers both this
* handler and the browser entry's popstate handler which calls
* __VINEXT_RSC_NAVIGATE__), we must wait for the new content to render
* before scrolling. Otherwise the user sees old content flash at the
* restored scroll position.
*
* This handler fires before the browser entry's popstate handler (because
* navigation.ts is loaded before hydration completes), so we defer via a
* microtask to give the browser entry handler a chance to set
* __VINEXT_RSC_PENDING__. Promise.resolve() schedules a microtask
* that runs after all synchronous event listeners have completed.
*/
function restoreScrollPosition(state) {
	if (state && typeof state === "object" && "__vinext_scrollY" in state) {
		const { __vinext_scrollX: x, __vinext_scrollY: y } = state;
		Promise.resolve().then(() => {
			const pending = window.__VINEXT_RSC_PENDING__ ?? null;
			if (pending) pending.then(() => {
				requestAnimationFrame(() => {
					window.scrollTo(x, y);
				});
			});
			else requestAnimationFrame(() => {
				window.scrollTo(x, y);
			});
		});
	}
}
/**
* Navigate to a URL, handling external URLs, hash-only changes, and RSC navigation.
*/
async function navigateClientSide(href, mode, scroll, programmaticTransition = false) {
	let normalizedHref = href;
	if (isExternalUrl(href)) {
		const localPath = toSameOriginAppPath(href, "");
		if (localPath == null) {
			if (mode === "replace") window.location.replace(href);
			else window.location.assign(href);
			return;
		}
		normalizedHref = localPath;
	}
	const fullHref = toBrowserNavigationHref(normalizedHref, window.location.href, "");
	notifyAppRouterTransitionStart(fullHref, mode);
	if (mode === "push") saveScrollPosition();
	if (isHashOnlyChange(fullHref)) {
		const hash = fullHref.includes("#") ? fullHref.slice(fullHref.indexOf("#")) : "";
		if (mode === "replace") replaceHistoryStateWithoutNotify(null, "", fullHref);
		else pushHistoryStateWithoutNotify(null, "", fullHref);
		commitClientNavigationState();
		if (scroll) scrollToHash(hash);
		return;
	}
	const hashIdx = fullHref.indexOf("#");
	const hash = hashIdx !== -1 ? fullHref.slice(hashIdx) : "";
	if (typeof window.__VINEXT_RSC_NAVIGATE__ === "function") await window.__VINEXT_RSC_NAVIGATE__(fullHref, 0, "navigate", mode, void 0, programmaticTransition);
	else {
		if (mode === "replace") replaceHistoryStateWithoutNotify(null, "", fullHref);
		else pushHistoryStateWithoutNotify(null, "", fullHref);
		commitClientNavigationState();
	}
	if (scroll) if (hash) scrollToHash(hash);
	else window.scrollTo(0, 0);
}
/**
* App Router public router instance. Mirrors Next.js's
* `publicAppRouterInstance` from
* `packages/next/src/client/components/app-router-instance.ts`.
*
* Exported so the App Router browser entry can install it on
* `window.next.router` for Next.js parity (see `client/window-next.ts`).
* Internal callers in this file continue to use `_appRouter` for brevity.
*/
var _appRouter = {
	bfcacheId: "0",
	push(href, options) {
		assertSafeNavigationUrl(href);
		if (isServer) return;
		import_react.startTransition(() => {
			navigateClientSide(href, "push", options?.scroll !== false, true);
		});
	},
	replace(href, options) {
		assertSafeNavigationUrl(href);
		if (isServer) return;
		import_react.startTransition(() => {
			navigateClientSide(href, "replace", options?.scroll !== false, true);
		});
	},
	back() {
		if (isServer) return;
		window.history.back();
	},
	forward() {
		if (isServer) return;
		window.history.forward();
	},
	refresh() {
		if (isServer) return;
		const clearCaches = window.__VINEXT_CLEAR_NAV_CACHES__;
		if (typeof clearCaches === "function") clearCaches();
		const rscNavigate = window.__VINEXT_RSC_NAVIGATE__;
		if (typeof rscNavigate === "function") {
			const navigate = () => {
				rscNavigate(window.location.href, 0, "refresh", void 0, void 0, true);
			};
			import_react.startTransition(navigate);
		}
	},
	prefetch(href) {
		assertSafeNavigationUrl(href);
		if (isServer) return;
		(async () => {
			let prefetchHref = href;
			if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) {
				const localPath = toSameOriginAppPath(href, "");
				if (localPath == null) return;
				prefetchHref = localPath;
			}
			const fullHref = toBrowserNavigationHref(prefetchHref, window.location.href, "");
			const interceptionContext = getCurrentInterceptionContext();
			const mountedSlotsHeader = getMountedSlotsHeader();
			const headers = createRscRequestHeaders({ interceptionContext });
			if (mountedSlotsHeader) headers.set(VINEXT_MOUNTED_SLOTS_HEADER, mountedSlotsHeader);
			const rscUrl = await createRscRequestUrl(fullHref, headers);
			const cacheKey = AppElementsWire.encodeCacheKey(rscUrl, interceptionContext);
			const prefetched = getPrefetchedUrls();
			if (prefetched.has(cacheKey)) return;
			prefetched.add(cacheKey);
			prefetchRscResponse(rscUrl, fetch(rscUrl, {
				headers,
				credentials: "include",
				priority: "low"
			}), interceptionContext, mountedSlotsHeader);
		})().catch((error) => {
			console.error("[vinext] RSC prefetch setup error:", error);
		});
	}
};
/**
* App Router's useRouter — returns push/replace/back/forward/refresh.
* Different from Pages Router's useRouter (next/router).
*
* Returns a stable singleton: the same object reference on every call,
* matching Next.js behavior so components using referential equality
* (e.g. useMemo / useEffect deps, React.memo) don't re-render unnecessarily.
*/
function useRouter() {
	return _appRouter;
}
if (!isServer) {
	const state = getClientNavigationState();
	if (state && !state.patchInstalled) {
		state.patchInstalled = true;
		window.addEventListener("popstate", (event) => {
			if (typeof window.__VINEXT_RSC_NAVIGATE__ !== "function") {
				commitClientNavigationState();
				restoreScrollPosition(event.state);
			}
		});
		window.history.pushState = function patchedPushState(data, unused, url) {
			state.originalPushState.call(window.history, data, unused, url);
			if (state.suppressUrlNotifyCount === 0) commitClientNavigationState();
		};
		window.history.replaceState = function patchedReplaceState(data, unused, url) {
			state.originalReplaceState.call(window.history, data, unused, url);
			if (state.suppressUrlNotifyCount === 0) commitClientNavigationState();
		};
	}
}
//#endregion
//#region lib/jimothy-results.ts
var results = {
	"sleepy-jimothy": {
		slug: "sleepy-jimothy",
		name: "Sleepy Jimothy",
		eyebrow: "COZY · TIRED · UNBOTHERED",
		keywords: [
			"Cozy",
			"Tired",
			"Unbothered"
		],
		image: "/assets/jimothy-sleepy-transparent.png",
		tone: "#9a87e8",
		summary: "You have mastered the ancient art of being present enough to be lovable, but relaxed enough to miss the group chat entirely.",
		shareLine: "I woke up tired. This explains everything.",
		snack: "A warm cinnamon roll found at exactly the right time.",
		catchphrase: "Wake me when it gets interesting.",
		seoDescription: "You got Sleepy Jimothy: the cozy, tired, unbothered result from the Jimothy personality quiz.",
		description: "You are the soft center of a very loud world. Your instinct is to make a nest out of any available blanket, hoodie, or suspiciously clean patch beside a trash can. When everyone else is spiraling, you remember that most emergencies can wait until after a snack and a serious nap. Friends see you as comforting, funny, and mysteriously impossible to schedule before noon."
	},
	"angel-jimothy": {
		slug: "angel-jimothy",
		name: "Angel Jimothy",
		eyebrow: "KIND · PROTECTIVE · PURE",
		keywords: [
			"Kind",
			"Protective",
			"Pure"
		],
		image: "/assets/jimothy-saint-transparent.png",
		tone: "#f0b94f",
		summary: "You are the gentle guardian of the group: equal parts wholesome, observant, and quietly impossible to fool.",
		shareLine: "I got Angel Jimothy. I will be accepting snacks and praise.",
		snack: "A perfectly shared bag of honey butter chips.",
		catchphrase: "I brought you one too.",
		seoDescription: "You got Angel Jimothy: the kind, protective, pure result from the Jimothy personality quiz.",
		description: "You notice when people need help before they say it, show up with a practical solution, and make kindness look more iconic than chaos. Friends trust you with secrets, rides home, and the last good snack. Beneath the halo is someone with clear values and a surprisingly firm boundary when it matters."
	},
	"cool-jimothy": {
		slug: "cool-jimothy",
		name: "Cool Jimothy",
		eyebrow: "CONFIDENT · MYSTERIOUS · ICONIC",
		keywords: [
			"Confident",
			"Mysterious",
			"Iconic"
		],
		image: "/assets/jimothy-summer-transparent.png",
		tone: "#65d6c3",
		summary: "You enter every situation like the soundtrack has already started and the camera knows your good side.",
		shareLine: "I got Cool Jimothy. I had it handled.",
		snack: "A midnight taco from a place with no website.",
		catchphrase: "I had it handled.",
		seoDescription: "You got Cool Jimothy: the confident, mysterious, iconic result from the Jimothy personality quiz.",
		description: "You never appear rushed, even when the plan is clearly on fire. You speak sparingly, but every sentence lands like a caption people immediately want to repost. Friends see you as equal parts reliable and impossible to read, which is exactly the balance you prefer."
	},
	"chaotic-jimothy": {
		slug: "chaotic-jimothy",
		name: "Chaotic Jimothy",
		eyebrow: "CHAOTIC · CURIOUS · UNPREDICTABLE",
		keywords: [
			"Chaotic",
			"Curious",
			"Unpredictable"
		],
		image: "/assets/jimothy-raccoon-cropped.png",
		tone: "#ff7a59",
		summary: "You treat every tiny impulse like a potential origin story, and somehow people are glad you do.",
		shareLine: "Somehow this explains everything.",
		snack: "Spicy chips eaten directly from the bag at 3:07 a.m.",
		catchphrase: "Okay, but what if we did?",
		seoDescription: "You got Chaotic Jimothy: the chaotic, curious, unpredictable result from the Jimothy personality quiz.",
		description: "You are a beautiful public-safety concern with excellent instincts for finding the most interesting possible version of an ordinary night. You see a closed door and wonder what the plot is. Friends see you as the spark plug of the group: occasionally exhausting, always memorable, and usually the reason there is a story to tell."
	},
	"king-jimothy": {
		slug: "king-jimothy",
		name: "King Jimothy",
		eyebrow: "ROYAL · BOLD · UNFORGETTABLE",
		keywords: [
			"Royal",
			"Bold",
			"Unforgettable"
		],
		image: "/assets/jimothy-crown.png",
		tone: "#ffba3d",
		summary: "You do not enter a room. You arrive, and the room quietly realizes it has been waiting for you.",
		shareLine: "I got King Jimothy. Please address me accordingly.",
		snack: "A photogenic strawberry soda with too much ice.",
		catchphrase: "Be honest: was that iconic?",
		seoDescription: "You got King Jimothy: the royal, bold, unforgettable result from the Jimothy personality quiz.",
		description: "You have the rare ability to turn a trip to the corner store into a season finale. You understand timing, atmosphere, and the importance of a well-placed dramatic pause. Friends see you as magnetic, hilarious, and often responsible for the best photos."
	}
};
Object.values(results);
//#endregion
//#region app/quiz/quiz-client.tsx
var import_jsx_runtime = require_jsx_runtime();
var questions = [
	{
		question: "You find an unattended trash can. What do you do?",
		options: [
			{
				text: "Take a nap beside it",
				result: "sleepy-jimothy"
			},
			{
				text: "Inspect it for snacks",
				result: "chaotic-jimothy"
			},
			{
				text: "Knock it over immediately",
				result: "chaotic-jimothy"
			},
			{
				text: "Pose for a photo first",
				result: "king-jimothy"
			}
		]
	},
	{
		question: "What is your ideal Friday night?",
		options: [
			{
				text: "Sleeping for 14 hours",
				result: "sleepy-jimothy"
			},
			{
				text: "Helping a friend",
				result: "angel-jimothy"
			},
			{
				text: "Showing up mysteriously in sunglasses",
				result: "cool-jimothy"
			},
			{
				text: "Making a decision I’ll regret tomorrow",
				result: "chaotic-jimothy"
			}
		]
	},
	{
		question: "Someone says you look unusual. You:",
		options: [
			{
				text: "Go back to sleep",
				result: "sleepy-jimothy"
			},
			{
				text: "Thank them politely",
				result: "angel-jimothy"
			},
			{
				text: "Put on sunglasses",
				result: "cool-jimothy"
			},
			{
				text: "Become an internet celebrity",
				result: "king-jimothy"
			}
		]
	},
	{
		question: "Choose your survival item.",
		options: [
			{
				text: "A pillow",
				result: "sleepy-jimothy"
			},
			{
				text: "A glowing halo",
				result: "angel-jimothy"
			},
			{
				text: "Sunglasses",
				result: "cool-jimothy"
			},
			{
				text: "A tiny crown",
				result: "king-jimothy"
			}
		]
	},
	{
		question: "Your friends describe you as:",
		options: [
			{
				text: "Permanently tired",
				result: "sleepy-jimothy"
			},
			{
				text: "Suspiciously wholesome",
				result: "angel-jimothy"
			},
			{
				text: "Effortlessly cool",
				result: "cool-jimothy"
			},
			{
				text: "A public safety concern",
				result: "chaotic-jimothy"
			}
		]
	},
	{
		question: "What would make you go viral?",
		options: [
			{
				text: "Sleeping in a strange place",
				result: "sleepy-jimothy"
			},
			{
				text: "Saving someone",
				result: "angel-jimothy"
			},
			{
				text: "Looking iconic without trying",
				result: "cool-jimothy"
			},
			{
				text: "Accidentally destroying something",
				result: "chaotic-jimothy"
			}
		]
	},
	{
		question: "Complete the sentence: Hot Jimothy Summer means…",
		options: [
			{
				text: "Canceling plans and resting",
				result: "sleepy-jimothy"
			},
			{
				text: "Spreading kindness",
				result: "angel-jimothy"
			},
			{
				text: "Looking cool at all times",
				result: "cool-jimothy"
			},
			{
				text: "Embracing absolute chaos",
				result: "chaotic-jimothy"
			}
		]
	}
];
function QuizClient() {
	const router = useRouter();
	const [answers, setAnswers] = (0, import_react.useState)([]);
	const [started, setStarted] = (0, import_react.useState)(false);
	const choose = (choice) => {
		const next = [...answers, choice];
		if (next.length === questions.length) {
			const score = next.reduce((count, id) => ({
				...count,
				[id]: count[id] + 1
			}), Object.fromEntries(Object.keys(results).map((id) => [id, 0])));
			const winner = Object.keys(score).reduce((best, id) => score[id] > score[best] ? id : best, next[0]);
			router.push(`/results/${winner}`);
			return;
		}
		setAnswers(next);
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
					href: "/",
					children: "MEME MAKER"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#about",
					children: "ABOUT THE QUIZ"
				})] })]
			}),
			!started && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "quiz-hero",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "quiz-orbit orbit-one" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "quiz-orbit orbit-two" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "THE SHAREABLE RACCOON PERSONALITY QUIZ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						"Which Jimothy",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "Are You?" })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Answer 7 chaotic questions. Get the result card your group chat deserves." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "primary-quiz",
						onClick: () => setStarted(true),
						children: ["Find My Jimothy ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "7 questions · 2 minutes · maximum nonsense" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hero-characters",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/assets/jimothy-sleepy-transparent.png",
								alt: "Sleepy Jimothy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/assets/jimothy-saint-transparent.png",
								alt: "Angel Jimothy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/assets/jimothy-summer-transparent.png",
								alt: "Cool Jimothy"
							})
						]
					})
				]
			}),
			started && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "question-shell",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "quiz-progress",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"QUESTION ",
								answers.length + 1,
								" / 7"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${answers.length / questions.length * 100}%` } }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [Math.round(answers.length / questions.length * 100), "%"] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "THIS IS SCIENCE (SORT OF)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: questions[answers.length].question }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "answers",
						children: questions[answers.length].options.map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => choose(option.result),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["0", index + 1] }),
								option.text,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "→" })
							]
						}, option.text))
					}),
					answers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "back-answer",
						onClick: () => setAnswers((items) => items.slice(0, -1)),
						children: "← Change previous answer"
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
						href: "/",
						children: "Meme Maker →"
					})
				]
			})
		]
	});
}
//#endregion
export { QuizClient as default };
