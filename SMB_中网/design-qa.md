# Design QA — ThinkPad增值换新 H5

- Source visual truth path: `public/qa/source-visual.png`
- Implementation: `http://127.0.0.1:4173/`
- Implementation screenshot evidence: Codex in-app browser capture of the local URL on 2026-10-21; the browser capture is session evidence and was not exported as a separate filesystem image.
- Source pixels: 853 × 1844
- Normalized source size: 393 × 852 CSS px
- Implementation screen: iPhone runtime, 393 × 852 CSS px
- State: first device selected, “服务状态” Tab, 增值换新有效且当前可行权

## Findings

No actionable P0/P1/P2 findings remain.

- Full-view comparison evidence: the original 393 × 852 visual reference and the revised iPhone implementation were both opened during this QA pass. The page hierarchy, device carousel, selected-device card, Tabs, action area and footer remain aligned; the shorter service region is the intended product-scope change.
- Focused region comparison evidence: the rendered “服务状态” region was inspected at readable scale. It contains exactly one “增值换新” card, one relevant state description, the applicable action button and the fixed service disclaimer; no residual generic-service divider or empty row remains.

- Typography and layout: the existing header, horizontal device carousel, selected-device card, single service card and fixed upper-right binding entry remain consistent with the approved visual baseline.
- Information scope: per the 2026-10-21 product requirement, the “服务状态” Tab intentionally removes “主要保修”和“上门服务” from the earlier source visual and retains only “增值换新”. This is an approved scope change rather than visual drift.
- Colors: Lenovo red remains the primary action color; effective service states remain green; disabled, exercised and expired states use neutral gray.
- Copy: the page consistently uses “ThinkPad增值换新” and “增值换新”; the data footer now labels the local timestamp as “查询于”, avoiding any claim that it is the upstream source-data update time.
- Data ownership: the prototype models the Baiying response as “是否有服务＋服务起止时间＋最终服务状态”; one presentation function maps that response to page copy, status light and button state without date calculations.
- Safety: the eligible button first enters “正在确认状态…”, then opens the partner handoff sheet only after the simulated Baiying recheck succeeds.

## Focused state evidence

- Eligible: status “有效”, description “当前可行权”, red “立即增值换新” button.
- Not yet eligible: service is already valid; status “有效”, description and disabled button both read “未到行权有效期”.
- Exercised: status “失效”, description “已行权”, no action button.
- Expired: period and status “已过期” are shown; no description or action button.
- No service: no period or status; only “可前往联想官网了解‘ThinkPad增值换新’服务”; no action button.
- Invalid or incomplete response: the presentation layer falls back to “服务状态暂不可用，请稍后重试” and exposes no action button.
- Device information Tab: CPU型号、内存容量、硬盘、显卡、屏幕尺寸均可见; binding ownership and device-data source are distinguished.
- The service disclaimer remains present at the bottom of every service-state view.
- No “主要保修”“上门服务”或其他服务内容 remains in the rendered service Tab or mock data.

## Interaction checks

- Horizontal device switching updates selected state, count, device information and service state across all five mock devices.
- “服务状态” and “设备信息” Tabs switch correctly.
- Eligible action becomes temporarily disabled while showing the Baiying recheck state, then opens the handoff sheet with “联想百应已确认当前可行权”.
- Disabled action cannot be triggered.
- Exercised, expired and no-service states expose no action button.
- The existing bind-device sheet remains available from the fixed upper-right entry.

## Build checks

- Mobile runtime integrity check: passed (28 protected files).
- TypeScript and Vite production compilation: passed.
- The repository's post-build Sites packaging step remains blocked by the pre-existing missing `.openai/hosting.json`; it does not affect the local H5 runtime or this visual/interaction QA.

## Comparison history

1. The earlier approved baseline contained three service rows. The latest product scope requires only the value-added refresh service.
2. Fix: removed the two generic service data records and their rendering loop while preserving the service card, status mapping, action button and disclaimer.
3. Post-fix evidence: the 2026-10-21 iPhone browser capture shows one “增值换新” card with no residual generic service row; all five state variants and the click-time recheck still pass.

## Follow-up polish

- P3: the fifth mock device intentionally reuses the supplied P14s product image because the current local asset set contains four product images.

final result: passed
