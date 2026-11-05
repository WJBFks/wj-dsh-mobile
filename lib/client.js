window.__ModuleLoader__.load({
	id: "wj-dsh-mobile",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region src/client/mobile-adapt.ts
		/** Storage key for the manual desktop opt-out. */
		const FORCE_DESKTOP_KEY = "wj-dsh-mobile-force-desktop";
		/** Storage key for the dragged whale position. */
		const WHALE_POS_KEY = "dsh-remote-whale-pos";
		/** Injected stylesheet identity. */
		const ADAPT_CSS_ID = "wj-dsh-remote/mobile-adapt.css";
		/** Body class while the adaptation is active. */
		const ACTIVE_CLASS = "dsh-remote-portrait";
		/** Body class while the collapsed rail is hidden behind the whale. */
		const RAIL_HIDDEN_CLASS = "dsh-remote-rail-hidden";
		/**
		* The official sidebar column root. Also the scope of the row sweep: every row
		* the drag suppression covers is a descendant of it, so the document-wide scan
		* it replaces only ever returned these.
		*/
		const SIDEBAR_SELECTOR = "[class*=\"_sidebarCol\"]";
		/** The official draggable session/project rows (see disableRowDrag). */
		const ROW_SELECTOR = "[class*=\"_sessionRow\"], [class*=\"_projectRow\"]";
		/** The injected stylesheet, addressed through the same cached lookup. */
		const STYLE_SELECTOR = `style[data-plugin-css="${ADAPT_CSS_ID}"]`;
		/** Whale button id. */
		const WHALE_ID = "dshRemoteWhale";
		/** Body class while the header actions are seated in the tabs row. */
		const HEADER_SEATED_CLASS = "dsh-remote-header-seated";
		/**
		* Width the seated header actions paint over the tabs row, as a CSS variable
		* on <html>. The row caps its own width with it (see the v80 rules) instead of
		* reserving the space with padding.
		*/
		const HEADER_RESERVE_VAR = "--dsh-remote-header-actions-reserve";
		/**
		* The official application frame. The layout column classes are the anchor:
		* `_frame` is shared by unrelated official components (the chat turn rail,
		* message-image thumbnails, the subagent pill, PlanReviewPanel), so a bare
		* suffix match would restyle and hit-block those. `data-dsh-frame` is the
		* aggregate compat stamp, kept as the fast path.
		*/
		const APP_FRAME_SELECTOR = "[data-dsh-frame], [class*=\"_frame\"]:has([class*=\"_centerCol\"])";
		/**
		* The official composer surface. `_composerSeat` is the plugin's historical
		* anchor; the official `data-dsh-surface="composer"` part attribute is the
		* stable alternative if the class ever gains a modifier.
		*/
		const COMPOSER_SELECTOR = "[class$=\"_composerSeat\"], [data-dsh-surface=\"composer\"]";
		/** Resolve the official application frame (never a nested `_frame` surface). */
		function appFrame() {
			const frame = document.querySelector(APP_FRAME_SELECTOR);
			return frame instanceof HTMLElement ? frame : null;
		}
		/**
		* Whether the current viewport is a portrait touch device small enough to
		* need the adaptation.
		*/
		function isMobilePortrait() {
			if (typeof window === "undefined") return false;
			if (typeof window.matchMedia !== "function") return false;
			if (!window.matchMedia("(orientation: portrait)").matches) return false;
			if (!window.matchMedia("(pointer: coarse)").matches) return false;
			if (window.innerWidth >= 1100) return false;
			if (window.sessionStorage.getItem(FORCE_DESKTOP_KEY) === "1") return false;
			return true;
		}
		/**
		* The injected rules. Grouped by surface; version comments trace rules back
		* to the dsh-LAN reference they were ported from.
		*/
		const ADAPT_CSS = [
			"html,body{height:100%}",
			"[class*=\"_frame\"]:has([class*=\"_centerCol\"]){width:100%;height:100dvh}",
			"[class$=\"_railFish\"] button,[class$=\"_panelIcon\"],[class$=\"_newSession\"]{min-width:44px;min-height:44px}",
			"[class$=\"_scroll\"]{padding:8px 10px}",
			"[class$=\"_input\"],textarea,input{font-size:16px}",
			"[class$=\"_composer\"]{padding-bottom:calc(4px + env(safe-area-inset-bottom))}",
			"[class$=\"_scrollBody\"] [class$=\"_root\"]{font-size:14.5px}",
			"[class$=\"_scrollBody\"] [class$=\"_bubble\"]{font-size:14.5px}",
			"[class$=\"_titleRow\"] *{font-size:13px}",
			"[class*=\"_sidebarCol\"] [class$=\"_root\"],[class*=\"_sidebarCol\"] [class$=\"_newSession\"],[class*=\"_sidebarCol\"] [class$=\"_trigger\"],[class*=\"_sidebarCol\"] [class$=\"_title\"]{font-size:13px}",
			"[class*=\"_sidebarCol\"] [class$=\"_meta\"],[class*=\"_sidebarCol\"] [class$=\"_time\"]{font-size:11.5px}",
			"[class$=\"_frame\"][data-sidebar-collapsed]{grid-template-columns:0 minmax(0,1fr) 0 !important}",
			"[class$=\"_frame\"][data-sidebar-collapsed] [class*=\"_sidebarCol\"]{grid-column:1/2}",
			"[class$=\"_frame\"][data-sidebar-collapsed] [class$=\"_centerCol\"]{grid-column:2/3}",
			"[class$=\"_frame\"][data-sidebar-collapsed] [class$=\"_detailsCol\"]{grid-column:3/4}",
			`body.${RAIL_HIDDEN_CLASS} [class$="_titleRow"]{padding-left:52px}`,
			`#${WHALE_ID}{position:fixed;top:calc(4px + env(safe-area-inset-top));left:calc(8px + env(safe-area-inset-left));z-index:2147482999;width:34px;height:34px;min-width:34px;padding:0;border-radius:10px;background:var(--dsw-alias-bg-module-platform);border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,.25)}`,
			`#${WHALE_ID} svg{width:20px;height:15px;display:block}`,
			`#${WHALE_ID}:active{opacity:.72}`,
			`#${WHALE_ID}{touch-action:none}`,
			"[class*=\"_sidebarCol\"] [class$=\"_logoRow\"] [class*=\"_iconButton\"]{width:18px;height:18px}",
			"[class*=\"_sidebarCol\"] [class$=\"_logoRow\"] [class*=\"_iconButton\"] svg{width:13px;height:13px;min-width:0;min-height:0}",
			"[class*=\"_sidebarCol\"] [class*=\"_projectRow\"] [class*=\"_rowActions\"]{display:inline-flex}",
			"[class*=\"_sidebarCol\"] [class*=\"_sessionRow\"],[class*=\"_sidebarCol\"] [class*=\"_projectRow\"]{-webkit-user-drag:none;user-select:none}",
			"[class$=\"_headerUtilities\"]{display:none}",
			"[class$=\"_composerSeat\"] [class$=\"_card\"]{margin-bottom:1px}",
			"[class$=\"_composerSeat\"] [class$=\"_row\"]{flex-wrap:wrap;row-gap:0;padding:2px 8px 1px;position:relative}",
			"[class$=\"_composerSeat\"] [class$=\"_add\"]{position:absolute;left:8px;top:50%;transform:translateY(-50%);z-index:10}",
			"[class$=\"_composerSeat\"] [class$=\"_modes\"]{min-width:0;padding-left:38px}",
			"[class$=\"_composerSeat\"] [class$=\"_trailing\"]{box-sizing:border-box;flex-basis:100%;min-height:32px;justify-content:flex-start;padding-left:38px;padding-right:78px}",
			"[class$=\"_composerSeat\"] [class$=\"_trailing\"] *{font-size:12px}",
			"[class$=\"_composerSeat\"] [class$=\"_modes\"] [class$=\"_trigger\"]{height:24px;min-height:24px;font-size:12px}",
			"[class$=\"_composerSeat\"] [class$=\"_trailing\"] [class$=\"_trigger\"]{height:24px;min-height:24px;font-size:11px}",
			"[class$=\"_composerSeat\"] [class$=\"_trailing\"] > [class$=\"_root\"]:has([class$=\"_track\"]){position:absolute;right:52px;top:50%;transform:translateY(-50%)}",
			"[class$=\"_composerSeat\"] [class$=\"_primary\"]{position:absolute;right:8px;top:50%;transform:translateY(-50%)}",
			"[class$=\"_composerSeat\"]{transform:none !important}",
			"[class$=\"_composerSeat\"] [class$=\"_menu\"]{position:fixed !important;left:8px !important;right:8px !important;top:auto !important;bottom:calc(8px + env(safe-area-inset-bottom)) !important;width:auto !important;max-width:none !important;max-height:70dvh !important;overflow-y:auto !important;z-index:2147482000}",
			"[class$=\"_composerSeat\"] [class$=\"_menu\"] [class$=\"_cell\"]{height:44px;min-height:44px;font-size:13px}",
			"[class$=\"_composerSeat\"] [data-slot=\"conversation.composer.dock\"] [class$=\"_root\"]{font-size:10px;white-space:normal;word-break:break-word;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-align:left;line-height:13px;letter-spacing:-0.2px;padding-left:0;padding-right:0}",
			"[class$=\"_scrollBody\"] [class$=\"_root\"]{font-size:13px}",
			"[class*=\"_bubble\"][role=\"tooltip\"]{display:none}",
			"[class$=\"_composerSeat\"] [class$=\"_frame\"]{box-sizing:border-box;width:100%;max-width:100%;padding-left:12px;padding-right:12px;height:auto;max-height:calc(100dvh - 96px);align-items:flex-start;overflow-y:auto}",
			"[class$=\"_composerSeat\"] [class$=\"_frame\"] [class$=\"_card\"]{max-width:none;width:100%}",
			`body.${HEADER_SEATED_CLASS} [class$="_header"] [class$="_titleCluster"] [class$="_headerActions"]{position:absolute;left:0;top:0;margin:0;display:flex;align-items:center;gap:6px;flex:none;z-index:2}`,
			"[class$=\"_header\"] [class$=\"_tabs\"] [class*=\"_tab\"]{font-size:12px;white-space:nowrap}",
			`body.${HEADER_SEATED_CLASS} [class$="_header"] [class$="_tabs"]{max-width:max(0px,calc(100% - var(${HEADER_RESERVE_VAR},0px)));overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding-bottom:2px;margin-bottom:-2px}`,
			`body.${HEADER_SEATED_CLASS} [class$="_header"] [class$="_tabs"]::-webkit-scrollbar{display:none}`,
			`body.${HEADER_SEATED_CLASS} [class$="_header"] [class$="_tabs"] > [class*="_tab"]{flex:0 0 auto}`,
			`body.${ACTIVE_CLASS} [class$=\"_detailsCol\"]{display:none !important}`,
			`body.${ACTIVE_CLASS} [data-dsh-plugin=\"ssh\"],`,
			`body.${ACTIVE_CLASS} [data-dsh-plugin=\"skill-explorer\"],`,
			`body.${ACTIVE_CLASS} [data-dsh-plugin=\"task-board\"],`,
			`body.${ACTIVE_CLASS} [data-dsh-plugin=\"git-graph\"],`,
			`body.${ACTIVE_CLASS} [data-dsh-plugin=\"pet\"],`,
			`body.${ACTIVE_CLASS} [data-dsh-plugin=\"usage\"]{display:none !important}`,
			`body.${ACTIVE_CLASS} [class$=\"_overlayLayer\"] [class$=\"_workbench\"]{display:none !important}`,
			`body.${ACTIVE_CLASS} [class$="_overlay"] [class$="_panel"]{flex-direction:column;max-height:calc(100dvh - 32px)}`,
			`body.${ACTIVE_CLASS} [class$="_overlay"] [class$="_panel"] [class$="_nav"]{flex-direction:row;gap:4px;width:100%;padding:12px 12px 0;overflow-x:auto;overflow-y:hidden}`,
			`body.${ACTIVE_CLASS} [class$="_overlay"] [class$="_panel"] [class$="_navTitle"]{display:none}`,
			`body.${ACTIVE_CLASS} [class$="_overlay"] [class$="_panel"] [class$="_navList"]{flex-direction:row;gap:4px}`,
			`body.${ACTIVE_CLASS} [class$="_overlay"] [class$="_panel"] [class$="_navCell"]{height:34px;padding:0 12px;gap:6px;flex:none;border-radius:10px}`,
			`body.${ACTIVE_CLASS} [class$="_overlay"] [class$="_panel"] [class$="_navLabel"]{font-size:13px}`,
			`body.${ACTIVE_CLASS} [class$="_overlay"] [class$="_panel"] [class$="_content"]{flex:1;min-height:0}`
		];
		/** The DeepSeek fish glyph (the official brand mark path). */
		const FISH_PATH = "M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018Z";
		/**
		* Install the adaptation layer. Runs once per page (idempotent); the
		* evaluate loop re-applies on orientation/resize and reverts off-portrait.
		*/
		function startMobileAdapt() {
			if (typeof window === "undefined" || typeof document === "undefined") return;
			if (window.__dshRemoteAdaptInstalled === true) return;
			window.__dshRemoteAdaptInstalled = true;
			const w = window;
			/**
			* Label lookup for the injected surfaces: the `remote` namespace seat wired
			* by the plugin apply, else the English fallback (the SDK's universal
			* fallback; the sync tick re-renders the labels once the seat is live).
			*/
			const surfaceText = (key, fallback) => {
				try {
					const out = w.__dshRemoteAdapt?.translate?.(key);
					return typeof out === "string" && out.length > 0 ? out : fallback;
				} catch {
					return fallback;
				}
			};
			let active = false;
			let savedViewportContent = null;
			let whaleEl = null;
			let whaleObserver = null;
			/** Header subtree observer: marks the geometry measurement dirty on re-render. */
			let headerObserver = null;
			/** Document child-list observer: invalidates the cached-absent selector set. */
			let domObserver = null;
			let observedHeader = null;
			/** Whether the seated-actions geometry needs re-measuring (see alignActionsText). */
			let headerGeometryDirty = true;
			let whaleTimer = null;
			let whaleSuppressClick = false;
			let whaleShown = false;
			let drag = null;
			let swipeTouch = null;
			let lastComposerTap = 0;
			let adaptEnabled = true;
			/**
			* Idempotently (re-)install the adaptation stylesheet. The rules live in
			* one <style> tag keyed by data-plugin-css; the sync tick re-runs this so
			* a tag lost to any external DOM cleanup is restored within one tick
			* instead of silently dropping the suppressions (portrait pet hiding,
			* rail compaction) while the body class stays.
			*/
			function ensureAdaptStyle() {
				if (nodeOf(STYLE_SELECTOR) !== null) return;
				const tag = document.createElement("style");
				tag.dataset.plugin = "wj-dsh-remote";
				tag.dataset.pluginCss = ADAPT_CSS_ID;
				tag.textContent = ADAPT_CSS.join("");
				document.head.appendChild(tag);
				nodeCache.set(STYLE_SELECTOR, tag);
				nodeMissCache.delete(STYLE_SELECTOR);
			}
			function apply() {
				if (active) return;
				active = true;
				forgetAbsentSelectors();
				document.body.classList.add(ACTIVE_CLASS);
				try {
					w.__dshRemoteAdapt?.closeDetails?.();
				} catch {}
				ensureAdaptStyle();
				const meta = document.querySelector("meta[name=viewport]");
				if (meta instanceof HTMLMetaElement && meta.getAttribute("content") !== null && !(meta.getAttribute("content") ?? "").includes("viewport-fit")) {
					savedViewportContent = meta.getAttribute("content");
					meta.setAttribute("content", `${savedViewportContent}, viewport-fit=cover`);
				}
				ensureWhale();
				ensureDomObserver();
				syncWhale();
				setWhaleTimer(true);
				seatHeaderActions();
			}
			function revert() {
				if (!active) return;
				active = false;
				unseatHeaderActions();
				restoreRowDrag();
				document.body.classList.remove(ACTIVE_CLASS);
				document.body.classList.remove(RAIL_HIDDEN_CLASS);
				document.querySelector(`style[data-plugin-css="${ADAPT_CSS_ID}"]`)?.remove();
				const meta = document.querySelector("meta[name=viewport]");
				if (meta instanceof HTMLMetaElement && savedViewportContent !== null) {
					meta.setAttribute("content", savedViewportContent);
					savedViewportContent = null;
				}
				if (whaleEl !== null) whaleEl.style.display = "none";
				whaleShown = false;
				setWhaleTimer(false);
				if (whaleObserver !== null) {
					whaleObserver.disconnect();
					whaleObserver = null;
				}
				if (domObserver !== null) {
					domObserver.disconnect();
					domObserver = null;
				}
				forgetAbsentSelectors();
			}
			/**
			* Observe the document for the two kinds of change that can make a cached-absent
			* target discoverable again (see nodeOf): node insertion/removal, and the
			* class / compat-stamp attributes the cached selectors match on.
			*
			* Body class writes are excluded by target: the layer toggles three body
			* classes every tick, and counting those would invalidate the negative cache
			* on every tick and restore the very scan this cache removes. They cannot
			* create a target either — every cached selector matches an element other
			* than <body>.
			*
			* The record queue is drained on a microtask, so this stays off the layout
			* path; a chat turn's insertions are a handful per second, not per element.
			*/
			function ensureDomObserver() {
				if (domObserver !== null || typeof MutationObserver === "undefined" || !document.body) return;
				domObserver = new MutationObserver((records) => {
					for (const record of records) if (record.type === "childList" || record.target !== document.body) {
						noteDomChange();
						return;
					}
				});
				domObserver.observe(document.body, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: ["class", "data-dsh-frame"]
				});
			}
			/** Start/stop the 600ms sync tick; a no-op when already in the asked state. */
			function setWhaleTimer(on) {
				if (on && whaleTimer === null && active) whaleTimer = window.setInterval(syncWhale, 600);
				else if (!on && whaleTimer !== null) {
					window.clearInterval(whaleTimer);
					whaleTimer = null;
				}
			}
			/**
			* The official sidebar toggle in the logo row. The row's own `_toggle` class
			* is the precise anchor; the row's last button is the fallback for cohorts
			* that only expose the generic icon-button class (the first button is the
			* brand, which navigates home — never click that one). `_railFish` is kept
			* for older compositions that carried a rail fish button.
			*/
			function officialSidebarToggle() {
				const rail = document.querySelector("[class$=\"_railFish\"] button");
				if (rail instanceof HTMLElement) return rail;
				const row = document.querySelector("[class$=\"_logoRow\"]");
				if (row === null) return null;
				const toggles = row.querySelectorAll("button[class*=\"_toggle\"]");
				const last = toggles.length > 0 ? toggles[toggles.length - 1] : row.querySelectorAll("button")[row.querySelectorAll("button").length - 1];
				return last instanceof HTMLElement ? last : null;
			}
			/**
			* Toggle the sidebar through the official rail/logo toggle first, then
			* verify the flip and fall back to the wired layout face.
			*
			* The order is evidence-driven: the official toggle owns its own store
			* actions and flips the state on every cohort we support, while the wired
			* LayoutController is mounted yet inert on the installed cohort — calling it
			* left `data-sidebar-collapsed` untouched for the whole 800ms observation
			* window, so face-first made every whale tap wait out the verification
			* delay before anything moved. The face stays the fallback for compositions
			* that render no logo-row toggle, and it is only called after the toggle
			* demonstrably failed, so the two can never cancel each other out.
			*/
			function toggleSidebarVerified() {
				const frame = appFrame();
				const collapsedBefore = frame !== null ? frame.hasAttribute("data-sidebar-collapsed") : null;
				const face = w.__dshRemoteAdapt?.toggleSidebar;
				const callFace = () => {
					if (typeof face !== "function") return;
					try {
						face();
					} catch {}
				};
				const toggle = officialSidebarToggle();
				if (collapsedBefore === null || toggle === null) {
					if (toggle !== null) toggle.click();
					else callFace();
					return;
				}
				toggle.click();
				let tries = 0;
				const verify = () => {
					if (!active) return;
					const frameNow = appFrame();
					if (frameNow === null) return;
					if (frameNow.hasAttribute("data-sidebar-collapsed") !== collapsedBefore) return;
					tries += 1;
					if (tries < 2) {
						window.setTimeout(verify, 120);
						return;
					}
					callFace();
				};
				window.setTimeout(verify, 120);
			}
			function ensureWhale() {
				if (whaleEl !== null || !document.body) return;
				const whale = document.createElement("button");
				whale.id = WHALE_ID;
				whale.type = "button";
				whale.dataset.dshPlugin = "wj-dsh-remote";
				const whaleLabel = surfaceText("mobile.whale.open", "Open sidebar");
				whale.title = whaleLabel;
				whale.setAttribute("aria-label", whaleLabel);
				whale.innerHTML = `<svg viewBox="0 0 23.16 17.04" fill="none" aria-hidden="true"><path d="${FISH_PATH}" fill="currentColor"/></svg>`;
				whale.addEventListener("click", () => {
					if (whaleSuppressClick) {
						whaleSuppressClick = false;
						return;
					}
					toggleSidebarVerified();
				});
				whale.addEventListener("pointerdown", (e) => {
					if (whaleEl === null) return;
					if (e.button !== 0 && e.pointerType === "mouse") return;
					if (active && isComposerField(document.activeElement)) {
						document.activeElement.blur();
						lastComposerTap = 0;
					}
					drag = {
						x: e.clientX,
						y: e.clientY,
						left: whale.offsetLeft,
						top: whale.offsetTop,
						moved: false
					};
					try {
						whale.setPointerCapture(e.pointerId);
					} catch {}
					e.preventDefault();
					e.stopPropagation();
				});
				whale.addEventListener("pointermove", (e) => {
					if (whaleEl === null || drag === null) return;
					const dx = e.clientX - drag.x;
					const dy = e.clientY - drag.y;
					drag.moved = drag.moved || Math.abs(dx) > 3 || Math.abs(dy) > 3;
					whaleEl.style.left = `${Math.min(Math.max(4, drag.left + dx), window.innerWidth - 38)}px`;
					whaleEl.style.top = `${Math.min(Math.max(4, drag.top + dy), window.innerHeight - 38)}px`;
					e.preventDefault();
					e.stopPropagation();
				});
				const endWhaleDrag = () => {
					if (whaleEl === null || drag === null) return;
					const moved = drag.moved;
					drag = null;
					whaleSuppressClick = moved;
					try {
						window.localStorage.setItem(WHALE_POS_KEY, JSON.stringify({
							x: whaleEl.offsetLeft,
							y: whaleEl.offsetTop
						}));
					} catch {}
				};
				whale.addEventListener("pointerup", endWhaleDrag);
				whale.addEventListener("pointercancel", () => {
					drag = null;
					whaleSuppressClick = false;
				});
				whaleEl = whale;
				document.body.appendChild(whale);
			}
			/**
			* Write one row's recorded official draggable state back onto it.
			* @param row - the tracked row element.
			* @param original - the recorded attribute value, or null when it was absent.
			*/
			function restoreRowDragState(row, original) {
				if (original === null) row.removeAttribute("draggable");
				else row.setAttribute("draggable", original);
			}
			/**
			* Restore the official draggable state this layer overrode while active.
			* Rows are React-owned and may have been re-created meanwhile, so only the
			* tracked elements are touched; a detached element is written back too
			* (harmless, and it keeps the entry prunable at every tick).
			*/
			function restoreRowDrag() {
				if (dragOverridden.size === 0) return;
				for (const [row, original] of dragOverridden) restoreRowDragState(row, original);
				dragOverridden.clear();
			}
			/** Restore a dragged position when the whale becomes visible again. */
			function applyWhalePos() {
				if (whaleEl === null) return;
				let pos = null;
				try {
					pos = JSON.parse(window.localStorage.getItem(WHALE_POS_KEY) ?? "null");
				} catch {}
				if (pos !== null && typeof pos.x === "number" && typeof pos.y === "number") {
					const x = Math.min(Math.max(4, pos.x), window.innerWidth - 38);
					const y = Math.min(Math.max(4, pos.y), window.innerHeight - 38);
					whaleEl.style.left = `${x}px`;
					whaleEl.style.top = `${y}px`;
				}
			}
			/** Rows whose official draggable state this layer overrode (restored on revert). */
			const dragOverridden = /* @__PURE__ */ new Map();
			function disableRowDrag() {
				if (!active) return;
				const rows = sidebarRows();
				for (const row of rows) if (row.getAttribute("draggable") !== "false") {
					if (!dragOverridden.has(row)) dragOverridden.set(row, row.getAttribute("draggable"));
					row.setAttribute("draggable", "false");
				}
				if (dragOverridden.size === 0) return;
				for (const [row, original] of dragOverridden) {
					if (row.isConnected) continue;
					restoreRowDragState(row, original);
					dragOverridden.delete(row);
				}
			}
			/**
			* Official nodes resolved through the document and cached while they stay
			* connected. The sync tick runs every 600ms for the page lifetime, and these
			* selectors (suffix class matches, :has()) cannot use Blink's fast paths, so
			* every miss walks the whole mounted DOM — the official chat keeps the whole
			* conversation mounted, i.e. tens of thousands of elements. React replaces a
			* node on a major re-render, which the isConnected guard detects.
			*/
			const nodeCache = /* @__PURE__ */ new Map();
			/**
			* Selectors known to be absent as of {@link domGeneration}. A miss is the
			* common case, not the exception: the layer holds no overlay of its own, and
			* several official surfaces it looks for (tabs row, tools row, sidebar rows)
			* legitimately do not exist at once. Re-walking a conversation-sized document
			* for the same absent selector on every 600ms tick was waste that almost
			* always resolved to null: five document-wide lookups per tick on the measured
			* fixture, zero after this cache. That is a lookup count — the wall-clock
			* saving is real while the mounted content is quiet and shrinks to the
			* row-scope saving when a turn streams (see the Agent Note for the harness and
			* the before/after numbers).
			*
			* A miss is trusted only while the observed content has not changed, so a
			* surface that appears is still found on the very next tick — the same
			* discovery latency the unconditional probe had. The cache is never aged by a
			* clock: it is cleared by {@link noteDomChange} while the observer is live and
			* by {@link forgetAbsentSelectors} across the windows where it is not (apply
			* and revert). One blind spot is deliberate and load-bearing: the observer
			* watches <body>, so a head-resident target is not covered by that signal —
			* the one such target is seeded into the cache where it is created (see
			* ensureAdaptStyle).
			*/
			const nodeMissCache = /* @__PURE__ */ new Set();
			/**
			* Bumped whenever a cached target may have appeared or disappeared. A surface
			* qualifies on a class token or on the aggregate compat stamp
			* (`data-dsh-frame`), so both insertions/removals AND those two attributes
			* can change the answer. Nothing the layer writes per tick lands here: its own
			* class writes are all on <body>, and its row/transform/label writes touch
			* other attributes entirely (see ensureDomObserver).
			*/
			let domGeneration = 0;
			/** The generation the negative cache was recorded against. */
			let missGeneration = -1;
			function noteDomChange() {
				domGeneration += 1;
			}
			/**
			* Drop every cached "absent" verdict. Called on apply and revert: while the
			* observer is disconnected the layer is blind to insertions, so a verdict
			* recorded before the gap could otherwise outlive the change that falsified
			* it and be served without a probe. The positive cache needs no equivalent —
			* its `isConnected` guard already re-resolves a replaced node.
			*/
			function forgetAbsentSelectors() {
				nodeMissCache.clear();
				domGeneration += 1;
			}
			function nodeOf(selector) {
				const cached = nodeCache.get(selector);
				if (cached !== void 0) {
					if (cached.isConnected) return cached;
					nodeCache.delete(selector);
				}
				if (missGeneration !== domGeneration) {
					nodeMissCache.clear();
					missGeneration = domGeneration;
				}
				if (nodeMissCache.has(selector)) return null;
				const found = document.querySelector(selector);
				if (found === null) {
					nodeMissCache.add(selector);
					return null;
				}
				nodeCache.set(selector, found);
				return found;
			}
			/**
			* The session/project rows the drag suppression covers, scoped to the cached
			* sidebar root. Each row carries the sidebar column class as an ancestor, so
			* the document-wide scan this replaces only ever returned rows from here.
			*/
			function sidebarRows() {
				const sidebar = nodeOf(SIDEBAR_SELECTOR);
				if (sidebar === null) return [];
				return Array.from(sidebar.querySelectorAll(ROW_SELECTOR));
			}
			/** The official application frame, through the same cached lookup. */
			function frameEl() {
				const frame = nodeOf(APP_FRAME_SELECTOR);
				return frame instanceof HTMLElement ? frame : null;
			}
			function syncWhale() {
				if (active) ensureAdaptStyle();
				if (whaleEl === null) return;
				if (!active) {
					whaleEl.style.display = "none";
					return;
				}
				const collapsed = frameEl()?.hasAttribute("data-sidebar-collapsed") === true;
				const overlayUp = nodeOf("[class$=\"_overlay\"]") !== null;
				const show = collapsed && !overlayUp;
				if (show && !whaleShown) applyWhalePos();
				whaleEl.style.display = show ? "" : "none";
				whaleShown = show;
				const whaleLabel = surfaceText("mobile.whale.open", "Open sidebar");
				if (whaleEl.title !== whaleLabel) whaleEl.title = whaleLabel;
				if (whaleEl.getAttribute("aria-label") !== whaleLabel) whaleEl.setAttribute("aria-label", whaleLabel);
				document.body.classList.toggle(RAIL_HIDDEN_CLASS, collapsed);
				disableRowDrag();
				seatHeaderActions();
				alignActionsText();
			}
			function seatHeaderActions() {
				if (!active) return;
				const header = nodeOf("[class$=\"_header\"]");
				const tabs = header !== null ? header.querySelector("[class$=\"_tabs\"]") : null;
				const actions = header !== null ? header.querySelector("[class$=\"_titleCluster\"] [class$=\"_headerActions\"]") : null;
				const seated = header !== null && tabs !== null && actions !== null;
				document.body.classList.toggle(HEADER_SEATED_CLASS, seated);
				ensureHeaderObserver(seated ? header : null);
			}
			function alignActionsText() {
				if (!active) return;
				const header = nodeOf("[class$=\"_header\"]");
				if (header === null) return;
				const tabs = header.querySelector("[class$=\"_tabs\"]");
				const actions = header.querySelector("[class$=\"_titleCluster\"] [class$=\"_headerActions\"]");
				if (tabs === null || actions === null || !(tabs instanceof HTMLElement) || !(actions instanceof HTMLElement)) return;
				if (!headerGeometryDirty) return;
				headerGeometryDirty = false;
				const tabBtn = tabs.querySelector(":scope > [class*=\"_tab\"]");
				const textBottom = (el) => {
					if (el === null) return null;
					const text = Array.from(el.childNodes).find((n) => n.nodeType === 3 && n.textContent !== null && n.textContent.trim() !== "");
					if (text === void 0) return null;
					try {
						const range = document.createRange();
						range.selectNode(text);
						return range.getBoundingClientRect().bottom;
					} catch {
						return null;
					}
				};
				const translate = /translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/.exec(actions.style.transform ?? "");
				let dx = translate !== null ? parseFloat(translate[1] ?? "0") : 0;
				let dy = translate !== null ? parseFloat(translate[2] ?? "0") : 0;
				const actionsRect = actions.getBoundingClientRect();
				const headerRect = header.getBoundingClientRect();
				const headerStyle = getComputedStyle(header);
				const rightDiff = headerRect.right - (parseFloat(headerStyle.paddingRight) || 0) - (parseFloat(headerStyle.borderRightWidth) || 0) - actionsRect.right;
				if (Math.abs(rightDiff) >= .5) dx = Math.round((dx + rightDiff) * 10) / 10;
				const tabBottom = textBottom(tabBtn);
				if (tabBottom !== null) {
					let maxBottom = null;
					for (const sel of ["[class$=\"_label\"]", "[class$=\"_count\"]"]) {
						const b = textBottom(actions.querySelector(sel));
						if (b !== null && (maxBottom === null || b > maxBottom)) maxBottom = b;
					}
					if (maxBottom !== null) {
						const bottomDiff = tabBottom - maxBottom;
						if (Math.abs(bottomDiff) >= .5) dy = Math.round((dy + bottomDiff) * 10) / 10;
					}
				}
				const next = `translate(${dx}px, ${dy}px)`;
				if (actions.style.transform !== next) actions.style.transform = next;
				const reserve = `${Math.ceil(actionsRect.width) + 8}px`;
				const rootStyle = document.documentElement.style;
				if (rootStyle.getPropertyValue(HEADER_RESERVE_VAR) !== reserve) rootStyle.setProperty(HEADER_RESERVE_VAR, reserve);
			}
			function unseatHeaderActions() {
				document.body.classList.remove(HEADER_SEATED_CLASS);
				document.documentElement.style.removeProperty(HEADER_RESERVE_VAR);
				const header = document.querySelector("[class$=\"_header\"]");
				const tabs = header !== null ? header.querySelector("[class$=\"_tabs\"]") : null;
				const actions = header !== null ? header.querySelector("[class$=\"_titleCluster\"] [class$=\"_headerActions\"]") : null;
				if (actions instanceof HTMLElement) actions.style.transform = "";
				if (tabs instanceof HTMLElement) tabs.style.paddingRight = "";
				if (headerObserver !== null) {
					headerObserver.disconnect();
					headerObserver = null;
					observedHeader = null;
				}
			}
			function ensureWhaleObserver() {
				if (whaleObserver !== null || typeof MutationObserver === "undefined" || !document.body) return;
				whaleObserver = new MutationObserver(() => {
					syncWhale();
				});
				whaleObserver.observe(document.body, {
					attributes: true,
					attributeFilter: ["data-sidebar-collapsed"],
					subtree: true
				});
			}
			/**
			* Observe the conversation header subtree and mark its geometry dirty on any
			* re-render (label text, badge count, node replacement). The per-tick
			* alignment then reads layout only when the header actually changed instead
			* of on every tick while a message streams. The observer is swapped when the
			* header node is replaced and disconnected with the layer.
			*/
			function ensureHeaderObserver(header) {
				if (typeof MutationObserver === "undefined") return;
				if (observedHeader === header && headerObserver !== null) return;
				headerObserver?.disconnect();
				headerObserver = null;
				observedHeader = null;
				if (header === null) return;
				headerObserver = new MutationObserver(() => {
					headerGeometryDirty = true;
				});
				headerObserver.observe(header, {
					childList: true,
					subtree: true,
					characterData: true,
					attributes: true,
					attributeFilter: ["class"]
				});
				observedHeader = header;
				headerGeometryDirty = true;
			}
			function evaluate() {
				headerGeometryDirty = true;
				if (!adaptEnabled) {
					revert();
					return;
				}
				if (isMobilePortrait()) {
					apply();
					ensureWhaleObserver();
					if (active && drag === null) applyWhalePos();
				} else revert();
			}
			evaluate();
			window.addEventListener("orientationchange", evaluate);
			window.addEventListener("resize", evaluate);
			document.addEventListener("visibilitychange", () => {
				setWhaleTimer(document.visibilityState !== "hidden");
			});
			function onKeydownCapture(e) {
				if (!active) return;
				if (e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
				const t = e.target;
				if (!(t instanceof HTMLElement)) return;
				if (composerFieldOf(t) === null) return;
				if (e.isComposing || e.keyCode === 229) return;
				e.preventDefault();
				e.stopPropagation();
				try {
					document.execCommand("insertText", false, "\n");
				} catch {}
			}
			document.addEventListener("keydown", onKeydownCapture, true);
			function collapseSidebar() {
				toggleSidebarVerified();
			}
			function onClickCapture(e) {
				if (!active) return;
				const frame = appFrame();
				if (frame === null || frame.hasAttribute("data-sidebar-collapsed")) return;
				const t = e.target;
				if (!(t instanceof Element)) return;
				if (t.closest("[class*=\"_sidebarCol\"]") !== null) {
					const topNewSessionClicked = t.closest("[class$=\"_newSession\"], [class$=\"_brand\"]") !== null;
					let projectNewSessionClicked = false;
					const projectActions = t.closest("[class*=\"_projectRow\"] [class*=\"_rowActions\"]");
					if (projectActions !== null) {
						const btn = t.closest("button");
						const btns = projectActions.querySelectorAll("button");
						projectNewSessionClicked = btn !== null && btns.length > 0 && btn === btns[btns.length - 1];
					}
					let shouldCollapse = false;
					if (t.closest("[class*=\"_sessionRow\"]") !== null) shouldCollapse = t.closest("[class*=\"_rowActions\"]") === null;
					else if (t.closest("[class$=\"_settingsArea\"]") !== null || topNewSessionClicked || projectNewSessionClicked) shouldCollapse = true;
					if (shouldCollapse) collapseSidebar();
					return;
				}
				if (t.closest("[class$=\"_overlay\"], [class$=\"_dialog\"], [class$=\"_menu\"], [class*=\"_portal\"], [id=\"dshRemoteWhale\"], [id=\"dshLanGate\"]") !== null) return;
				collapseSidebar();
			}
			document.addEventListener("click", onClickCapture, true);
			function insideHScrollable(el) {
				let n = el;
				while (n !== null && n !== document.body) {
					const cs = getComputedStyle(n);
					if ((cs.overflowX === "auto" || cs.overflowX === "scroll") && n.scrollWidth > n.clientWidth + 4) return true;
					n = n.parentElement;
				}
				return false;
			}
			document.addEventListener("touchstart", (e) => {
				if (!active) return;
				if (e.touches.length > 1) {
					swipeTouch = null;
					return;
				}
				const t = e.target;
				const editable = t instanceof HTMLElement && t.isContentEditable;
				if (t instanceof Element && (t.tagName === "TEXTAREA" || t.tagName === "INPUT" || editable || t.closest(`#${WHALE_ID}`) !== null || t.closest("table, [class$=\"_table\"], [class$=\"_tablePane\"]") !== null)) {
					swipeTouch = null;
					return;
				}
				const ct = e.changedTouches[0];
				if (ct === void 0) return;
				swipeTouch = {
					x: ct.clientX,
					y: ct.clientY,
					id: ct.identifier,
					el: t instanceof Element ? t : null
				};
			}, {
				capture: true,
				passive: true
			});
			document.addEventListener("touchend", (e) => {
				if (swipeTouch === null) return;
				if (e.touches.length > 0) return;
				const ct = e.changedTouches[0];
				if (ct === void 0 || ct.identifier !== swipeTouch.id) return;
				const dx = ct.clientX - swipeTouch.x;
				const dy = ct.clientY - swipeTouch.y;
				const start = swipeTouch;
				swipeTouch = null;
				if (!active) return;
				if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
				if (start.el !== null && insideHScrollable(start.el)) return;
				const frame = frameEl();
				if (frame === null) return;
				if (nodeOf("[class$=\"_overlay\"], [class$=\"_dialog\"], [class$=\"_menu\"], [class*=\"_portal\"]") !== null) return;
				const collapsed = frame.hasAttribute("data-sidebar-collapsed");
				if (dx < 0 && !collapsed) collapseSidebar();
				else if (dx > 0 && collapsed) toggleSidebarVerified();
			}, {
				capture: true,
				passive: true
			});
			document.addEventListener("touchcancel", () => {
				swipeTouch = null;
			}, true);
			const LONG_PRESS_MS = 500;
			const LONG_PRESS_MOVE = 10;
			let longPress = null;
			let suppressSessionClickUntil = 0;
			let suppressSessionClickRow = null;
			let longPressMenuGuardUntil = 0;
			function clearLongPress() {
				if (longPress !== null) {
					if (longPress.timer !== null) window.clearTimeout(longPress.timer);
					longPress = null;
				}
			}
			function openSessionMenu(row) {
				const actions = row.querySelector("[class*=\"_rowActions\"]");
				const btn = actions?.querySelector("button");
				if (actions === null || btn === null) return;
				longPressMenuGuardUntil = Date.now() + 1200;
				actions.style.display = "inline-flex";
				try {
					btn.click();
				} finally {
					window.setTimeout(() => {
						actions.style.display = "";
					}, 50);
				}
			}
			document.addEventListener("touchstart", (e) => {
				if (!active) return;
				const t = e.target;
				if (!(t instanceof Element)) {
					clearLongPress();
					return;
				}
				const row = t.closest("[class*=\"_sessionRow\"]");
				if (row === null || t.closest("[class*=\"_rowActions\"]") !== null) {
					clearLongPress();
					return;
				}
				const ct = e.changedTouches[0];
				if (ct === void 0) return;
				clearLongPress();
				const lp = {
					row,
					x: ct.clientX,
					y: ct.clientY,
					timer: null,
					triggered: false
				};
				lp.timer = window.setTimeout(() => {
					if (longPress !== lp) return;
					lp.triggered = true;
					openSessionMenu(lp.row);
					try {
						navigator.vibrate?.(10);
					} catch {}
				}, LONG_PRESS_MS);
				longPress = lp;
			}, {
				capture: true,
				passive: true
			});
			document.addEventListener("touchmove", (e) => {
				if (!active || longPress === null) return;
				const ct = e.changedTouches[0];
				if (ct === void 0) return;
				if (Math.abs(ct.clientX - longPress.x) > LONG_PRESS_MOVE || Math.abs(ct.clientY - longPress.y) > LONG_PRESS_MOVE) clearLongPress();
			}, {
				capture: true,
				passive: true
			});
			document.addEventListener("touchend", (e) => {
				if (!active || longPress === null) return;
				if (e.changedTouches[0] === void 0) return;
				const lp = longPress;
				clearLongPress();
				if (lp.triggered) {
					e.preventDefault();
					suppressSessionClickUntil = Date.now() + 800;
					suppressSessionClickRow = lp.row;
				}
			}, {
				capture: true,
				passive: false
			});
			document.addEventListener("touchcancel", () => {
				clearLongPress();
			}, true);
			window.addEventListener("click", (e) => {
				if (!active || Date.now() > suppressSessionClickUntil) return;
				const t = e.target;
				if (t instanceof Element && suppressSessionClickRow !== null && (t === suppressSessionClickRow || suppressSessionClickRow.contains(t))) {
					e.stopPropagation();
					e.preventDefault();
					suppressSessionClickUntil = 0;
					suppressSessionClickRow = null;
				}
			}, true);
			document.addEventListener("contextmenu", (e) => {
				if (!active) return;
				const t = e.target;
				if (!(t instanceof Element)) return;
				if (t.closest("[class*=\"_sessionRow\"]") !== null && (longPress !== null && longPress.triggered || Date.now() <= suppressSessionClickUntil)) e.preventDefault();
			}, true);
			document.addEventListener("pointerleave", (e) => {
				if (!active || Date.now() > longPressMenuGuardUntil) return;
				const t = e.target;
				if (t instanceof Element && (t.closest("[class*=\"_rowActions\"]") !== null || t.closest("[class*=\"_sessionRow\"]") !== null || t.closest("[class*=\"_projectRow\"]") !== null)) e.stopPropagation();
			}, true);
			const isComposerField = (el) => {
				if (!(el instanceof HTMLElement)) return false;
				if (el.closest(COMPOSER_SELECTOR) === null) return false;
				if (el.matches("[data-composer-input]")) return true;
				if (el.tagName === "TEXTAREA") return true;
				return el.tagName === "INPUT" && el.matches("[class*=\"_input\"]");
			};
			/** The composer field that owns an event target, if any. */
			const composerFieldOf = (target) => {
				const el = target instanceof Element ? target.closest("[data-composer-input], [class*=\"_input\"], textarea") : null;
				return isComposerField(el) ? el : null;
			};
			const lanOrigFocus = HTMLElement.prototype.focus;
			const patchedFocus = function(options) {
				if (active && isComposerField(this) && Date.now() - lastComposerTap >= 800) return;
				lanOrigFocus.call(this, options);
			};
			/** (Re-)install the composer-focus guard (see setEnabled). */
			const installFocusPatch = () => {
				HTMLElement.prototype.focus = patchedFocus;
			};
			/**
			* Remove the guard when the layer is disabled. A patch another plugin
			* installed after ours is left alone (identity check), so disabling this
			* layer never removes someone else's behavior.
			*/
			const restoreFocusPatch = () => {
				if (HTMLElement.prototype.focus === patchedFocus) HTMLElement.prototype.focus = lanOrigFocus;
			};
			installFocusPatch();
			document.addEventListener("pointerdown", (e) => {
				if (!active) return;
				if (composerFieldOf(e.target) !== null) lastComposerTap = Date.now();
			}, true);
			w.__dshRemoteAdapt = {
				evaluate,
				toggleSidebar: null,
				closeDetails: null,
				translate: null,
				setEnabled(on) {
					adaptEnabled = on;
					if (on) {
						installFocusPatch();
						evaluate();
					} else {
						revert();
						restoreFocusPatch();
					}
				},
				flushCloseDetails() {
					if (active) w.__dshRemoteAdapt?.closeDetails?.();
				}
			};
		}
		//#endregion
		//#region src/client/index.ts
		/**
		* wj-dsh-mobile — browser half.
		*
		* Installs the portrait-touch adaptation layer (touch targets, safe areas,
		* whale sidebar button, swipe gestures, desktop-surface suppression) and wires
		* its two host hooks: the official layout service (sidebar toggle / details
		* close) and a tiny label seat for the whale button.
		*/
		const inject = ["layout"];
		function apply(ctx) {
			startMobileAdapt();
			const win = window;
			const adapt = win.__dshRemoteAdapt;
			const layout = ctx.get("layout");
			const call = (fn) => {
				try {
					fn?.();
				} catch {}
			};
			if (adapt !== void 0 && layout !== void 0) {
				if (typeof layout.toggleSidebar === "function") adapt.toggleSidebar = () => call(layout.toggleSidebar);
				if (typeof layout.closeDetails === "function") adapt.closeDetails = () => call(layout.closeDetails);
			}
			if (adapt !== void 0 && adapt.toggleSidebar === null) adapt.toggleSidebar = () => {
				document.querySelector("[class$=\"_railFish\"] button, [class$=\"_logoRow\"] [class*=\"_iconButton\"]")?.click();
			};
			const zh = typeof navigator !== "undefined" && (navigator.language ?? "").toLowerCase().startsWith("zh");
			if (adapt !== void 0) adapt.translate = (key) => zh && key === "mobile.whale.open" ? "打开侧栏" : "";
			ctx.effect?.(() => () => {
				win.__dshRemoteAdapt?.setEnabled?.(false);
			}, "wj-dsh-mobile: adapt");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map