import { useMemo, useState } from "react";
import { CheckIcon, ChevronLeftIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { BottomSheet, Carousel, MobileScroll } from "./mobile";

type ServiceStatus = "有效" | "已过期" | "未生效";

type ServiceRecord = {
  name: string;
  period: string;
  status: ServiceStatus;
};

type DeviceRecord = {
  id: string;
  name: string;
  shortName: string;
  sn: string;
  specs: string;
  boundAt: string;
  image: string;
  services: ServiceRecord[];
  eligibility: string;
  eligible: boolean;
};

const devices: DeviceRecord[] = [
  {
    id: "t14p",
    name: "ThinkPad T14p Gen 3",
    shortName: "T14p Gen 3",
    sn: "PF5HGSV5",
    specs: "Intel Core Ultra 7｜32GB｜2.8K OLED",
    boundAt: "2026-08-20",
    image: "/assets/products/thinkpad-t14p-gen3.png",
    services: [
      { name: "主要保修", period: "2025-11-01 至 2028-10-31", status: "有效" },
      { name: "上门服务", period: "2025-11-01 至 2027-10-31", status: "有效" },
      { name: "保值换新服务", period: "2025-11-01 至 2029-10-31", status: "有效" },
    ],
    eligibility: "当前可行权",
    eligible: true,
  },
  {
    id: "x1",
    name: "ThinkPad X1 Carbon Gen 12",
    shortName: "X1 Carbon G12",
    sn: "PF6ABCD8",
    specs: "Intel Core Ultra 5｜16GB｜2.8K OLED",
    boundAt: "2026-07-02",
    image: "/assets/products/thinkpad-x1-carbon-gen12.png",
    services: [
      { name: "主要保修", period: "2023-06-01 至 2026-05-31", status: "已过期" },
      { name: "上门服务", period: "2025-06-01 至 2027-05-31", status: "有效" },
      { name: "保值换新服务", period: "2025-06-01 至 2029-05-31", status: "有效" },
    ],
    eligibility: "当前不可行权",
    eligible: false,
  },
  {
    id: "t14s",
    name: "ThinkPad T14s Gen 5",
    shortName: "T14s Gen 5",
    sn: "PF7T14S5",
    specs: "AMD Ryzen 7 PRO｜32GB｜2.8K OLED",
    boundAt: "2026-05-16",
    image: "/assets/products/thinkpad-t14s-gen5.png",
    services: [
      { name: "主要保修", period: "2026-05-01 至 2029-04-30", status: "有效" },
      { name: "上门服务", period: "2026-05-01 至 2028-04-30", status: "有效" },
      { name: "保值换新服务", period: "2026-09-15 至 2030-04-30", status: "未生效" },
    ],
    eligibility: "当前不可行权",
    eligible: false,
  },
  {
    id: "p14s",
    name: "ThinkPad P14s Gen 5",
    shortName: "P14s Gen 5",
    sn: "PF8P14S5",
    specs: "Intel Core Ultra 7｜64GB｜2.8K OLED",
    boundAt: "2026-03-08",
    image: "/assets/products/thinkpad-p14s-gen5.png",
    services: [
      { name: "主要保修", period: "2024-03-01 至 2027-02-28", status: "有效" },
      { name: "上门服务", period: "2024-03-01 至 2026-02-28", status: "已过期" },
      { name: "保值换新服务", period: "2024-03-01 至 2026-08-15", status: "已过期" },
    ],
    eligibility: "当前不可行权",
    eligible: false,
  },
];

type SheetMode = "bind" | "trade" | null;

export default function Prototype() {
  const [selectedId, setSelectedId] = useState(devices[0].id);
  const [activeTab, setActiveTab] = useState<"service" | "device">("service");
  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [notice, setNotice] = useState("");

  const selectedIndex = devices.findIndex((device) => device.id === selectedId);
  const selected = useMemo(
    () => devices.find((device) => device.id === selectedId) ?? devices[0],
    [selectedId],
  );

  const chooseDevice = (id: string) => {
    setSelectedId(id);
    setActiveTab("service");
    setNotice("");
  };

  const showBackNotice = () => {
    setNotice("原型演示：返回会员个人中心");
    window.setTimeout(() => setNotice(""), 2200);
  };

  return (
    <div className="value-refresh-app">
      <header className="app-header" aria-label="保值换新页头">
        <button className="header-icon-button" type="button" aria-label="返回" onClick={showBackNotice}>
          <ChevronLeftIcon width="28" height="28" />
        </button>
        <h1>保值换新</h1>
        <button className="bind-device-button" type="button" onClick={() => setSheetMode("bind")}>
          绑定设备
        </button>
      </header>

      <MobileScroll className="app-screen">
        <main className="screen-content" aria-label="保值换新详情">
          <section className="device-switcher" aria-labelledby="device-list-title">
            <div className="device-switcher-heading">
              <div>
                <h2 id="device-list-title">我的设备 <span>4台</span></h2>
                <p>左右滑动切换设备</p>
              </div>
              <div className="carousel-position" aria-label={`第 ${selectedIndex + 1} 台，共 4 台`}>
                <div className="position-dots" aria-hidden="true">
                  {devices.map((device) => <i key={device.id} data-active={device.id === selectedId} />)}
                </div>
                <span>{selectedIndex + 1} / 4</span>
              </div>
            </div>

            <Carousel ariaLabel="已绑定设备，可左右滑动" className="device-carousel" contentClassName="device-carousel-track">
              {devices.map((device) => {
                const active = device.id === selectedId;
                return (
                  <button
                    key={device.id}
                    className="device-chip"
                    data-active={active}
                    type="button"
                    aria-pressed={active}
                    onClick={() => chooseDevice(device.id)}
                  >
                    <img src={device.image} alt="" draggable="false" />
                    <span className="device-chip-copy">
                      <strong>{device.shortName}</strong>
                      <small>{device.sn}</small>
                    </span>
                    <span className="device-chip-state" aria-hidden="true">
                      {active ? <CheckIcon width="14" height="14" /> : null}
                    </span>
                  </button>
                );
              })}
            </Carousel>
          </section>

          <section className="device-detail" aria-live="polite">
            <div className="device-profile">
              <div className="device-image-wrap">
                <img src={selected.image} alt={`${selected.name} 设备图`} draggable="false" />
              </div>
              <div className="device-profile-copy">
                <h2>{selected.name}</h2>
                <dl>
                  <div><dt>主机编号</dt><dd>{selected.sn}</dd></div>
                  <div><dt>配置</dt><dd>{selected.specs}</dd></div>
                  <div><dt>绑定时间</dt><dd>{selected.boundAt}</dd></div>
                </dl>
              </div>
            </div>

            <div className="detail-tabs" role="tablist" aria-label="设备详情切换">
              <button type="button" role="tab" aria-selected={activeTab === "service"} data-active={activeTab === "service"} onClick={() => setActiveTab("service")}>服务状态</button>
              <button type="button" role="tab" aria-selected={activeTab === "device"} data-active={activeTab === "device"} onClick={() => setActiveTab("device")}>设备信息</button>
            </div>

            {activeTab === "service" ? (
              <div className="service-panel" role="tabpanel">
                <div className="service-list">
                  {selected.services.map((service, index) => {
                    const isTradeIn = index === 2;
                    const valid = service.status === "有效";
                    return (
                      <article key={service.name} className="service-row" data-featured={isTradeIn}>
                        <div className="service-main-row">
                          <strong>{service.name}</strong>
                          <span className="service-period">{service.period}</span>
                          <span className="service-status" data-valid={valid}><i aria-hidden="true" />{service.status}</span>
                        </div>
                        {isTradeIn ? <div className="eligibility-result" data-eligible={selected.eligible}>联想百应返回：{selected.eligibility}</div> : null}
                      </article>
                    );
                  })}
                </div>

                {selected.eligible ? (
                  <button className="trade-in-button" type="button" onClick={() => setSheetMode("trade")}>立即保值换新</button>
                ) : (
                  <button className="trade-in-button" data-disabled="true" type="button" disabled>当前不可行权</button>
                )}
                <p className="partner-note">将携带加密会员ID与主机编号，前往有的卖</p>
              </div>
            ) : (
              <div className="device-info-panel" role="tabpanel">
                <dl>
                  <div><dt>设备名称</dt><dd>{selected.name}</dd></div>
                  <div><dt>主机编号</dt><dd>{selected.sn}</dd></div>
                  <div><dt>核心配置</dt><dd>{selected.specs}</dd></div>
                  <div><dt>绑定时间</dt><dd>{selected.boundAt}</dd></div>
                </dl>
                <p>设备信息来自会员中心已绑定设备。</p>
              </div>
            )}
          </section>

          <p className="source-note">服务数据由联想百应提供 <span aria-hidden="true">｜</span> 更新于 2026-08-31 15:42</p>
        </main>
      </MobileScroll>

      <div className="prototype-notice" data-visible={Boolean(notice)} role="status" aria-live="polite">{notice}</div>

      <BottomSheet open={sheetMode === "bind"} onOpenChange={(open) => setSheetMode(open ? "bind" : null)} title="绑定设备" description="将调起会员中心-乐享的既有设备绑定功能。" snap={0.42}>
        <div className="action-sheet-body">
          <p>原型中不新建绑定表单。绑定完成后，用户手动返回个人中心，再次进入本页。</p>
          <button type="button" onClick={() => setSheetMode(null)}><ExternalLinkIcon /> 演示：前往设备绑定</button>
        </div>
      </BottomSheet>

      <BottomSheet open={sheetMode === "trade"} onOpenChange={(open) => setSheetMode(open ? "trade" : null)} title="前往有的卖" description="继续后将携带加密会员ID与当前设备主机编号。" snap={0.44}>
        <div className="action-sheet-body">
          <div className="handoff-device"><img src={selected.image} alt="" draggable="false" /><div><strong>{selected.name}</strong><span>{selected.sn}</span></div></div>
          <button type="button" onClick={() => setSheetMode(null)}><ExternalLinkIcon /> 演示：继续保值换新</button>
        </div>
      </BottomSheet>
    </div>
  );
}
