import React from "react";

const paths = {
  search:"M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM16 16l6 6",
  globe:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2c-5 5-5 15 0 20 5-5 5-15 0-20Z",
  content:"M5 3h14v18H5zM8 7h8M8 11h8M8 15h5",
  image:"M3 3h18v18H3zM3 17l6-7 6 6 3-4 3 4M15 7h.01",
  megaphone:"M3 10v4h5l10 5V5L8 10H3Zm4 4 2 7h4l-2-6M21 9v6",
  arrow: "M4 12h15m-6-6 6 6-6 6",
  diagonal: "M5 19 19 5M5 5h14v14",
  down: "m5 9 7 7 7-7",
  left: "m15 5-7 7 7 7",
  plus: "M12 4v16M4 12h16",
  close: "m5 5 14 14M5 19 19 5",
  menu: "M4 6h16M4 12h16M4 18h16",
  check: "m5 12 4 4L19 6",
  pause: "M8 5v14M16 5v14",
  play: "m8 5 11 7-11 7V5Z",
  restart: "M4 10a8 8 0 1 1 1 7M4 4v6h6",
  customers:
    "M9 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM2 21v-4a7 7 0 0 1 14 0v4m1-17a3 3 0 0 1 0 6m3 11v-4a6 6 0 0 0-3-5",
  people:
    "M8 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm9 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM2 20v-4a6 6 0 0 1 12 0v4m2-8a5 5 0 0 1 6 5v3",
  chat: "M4 4h16v12H9l-5 5V4Zm4 4h8m-8 4h5",
  phone: "m8 3-4 1c-2 6 10 18 16 16l1-4-5-3-2 2c-2-1-4-3-5-5l2-2-3-5Z",
  ticket: "M4 4h16v6a2 2 0 0 0 0 4v6H4v-6a2 2 0 0 0 0-4V4Zm10 1v3m0 3v2m0 3v3",
  workflow: "M4 3h6v6H4zM15 15h6v6h-6zM15 3h6v6h-6zM7 9v9h8m-5-12h5",
  chart: "M4 3v17h17M8 15v-4m5 4V6m5 9V9",
  route: "M5 3v14a4 4 0 0 0 8 0V7a4 4 0 0 1 8 0v14m-3-3 3 3 3-3",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l4 2",
  target: "M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 12l8-8m-5 0h5v5",
  layers: "m12 3 10 6-10 6L2 9l10-6Zm-10 11 10 6 10-6M2 18l10 6 10-6",
  spark: "m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2Z",
  health: "M8 3h8v5h5v8h-5v5H8v-5H3V8h5V3Z",
  education: "m2 8 10-5 10 5-10 5L2 8Zm4 3v6c5 4 7 4 12 0v-6m4-3v10",
  building: "M4 21V8l8-5 8 5v13M8 21v-5h8v5M8 9h1m6 0h1M8 12h1m6 0h1",
  shop: "M4 10v11h16V10M3 4h18l1 6a3 3 0 0 1-5 2 3 3 0 0 1-5 0 3 3 0 0 1-5 0 3 3 0 0 1-5-2l1-6Zm7 17v-6h4v6",
  factory: "M3 21V9l6 4V7l6 4V3h5l1 18H3Zm4-4h1m4 0h1m4 0h1",
  briefcase: "M3 7h18v14H3zM8 7V3h8v4M3 12l9 4 9-4m-9 1v5",
  mail: "M3 5h18v14H3zM3 5l9 8 9-8",
  lock: "M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4",
};
export function Icon({ name = "arrow", className = "", ...props }) {
  return (
    <svg
      className={"icon " + className}
      viewBox="0 0 24 24"
      fill={name === "play" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
export function ToolMark({ slug, className = "" }) {
  const cls = "tool-mark " + className;
  if (slug === "highlevel")
    return (
      <svg className={cls} viewBox="0 0 40 40" aria-hidden="true">
        <path d="m3 13 6-7 6 7h-4v21H7V13Z" fill="#62BCEF" />
        <path d="m15 9 6-7 6 7h-4v25h-4V9Z" fill="#69CFBF" />
        <path d="m27 14 5-6 5 6h-3v20h-4V14Z" fill="#A7C873" />
      </svg>
    );
  if (slug === "n8n")
    return (
      <svg
        className={cls}
        viewBox="0 0 40 40"
        fill="none"
        stroke="#EA4B71"
        strokeWidth="2.6"
        aria-hidden="true"
      >
        <path d="M8 20h7l7-10h8M15 20l7 10h8" />
        <circle cx="6" cy="20" r="4" />
        <circle cx="31" cy="10" r="4" />
        <circle cx="31" cy="30" r="4" />
        <circle cx="17" cy="20" r="4" fill="#101F35" />
      </svg>
    );
  if (slug === "zapier")
    return (
      <svg
        className={cls}
        viewBox="0 0 40 40"
        stroke="#FF6A40"
        strokeWidth="5"
        aria-hidden="true"
      >
        <path d="M20 4v32M4 20h32M9 9l22 22M9 31 31 9" />
        <circle cx="20" cy="20" r="4" stroke="none" fill="#101F35" />
      </svg>
    );
  if (slug === "whatsapp")
    return (
      <svg className={cls} viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M20 3a16 16 0 0 0-14 24L3 37l10-3A16 16 0 1 0 20 3Z"
          fill="#25D366"
        />
        <path
          d="m15 11-3 2c-2 5 8 15 13 13l2-3-5-3-2 2-4-4 2-2-3-5Z"
          fill="#fff"
        />
      </svg>
    );
  if (slug === "twilio")
    return (
      <svg
        className={cls}
        viewBox="0 0 40 40"
        fill="#F22F46"
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="#F22F46"
          strokeWidth="4"
        />
        {[
          [15, 15],
          [25, 15],
          [15, 25],
          [25, 25],
        ].map(([x, y]) => (
          <circle key={x + "," + y} cx={x} cy={y} r="3.4" />
        ))}
      </svg>
    );
  if (slug === "exotel")
    return (
      <svg
        className={cls}
        viewBox="0 0 40 40"
        fill="none"
        stroke="#5CBAED"
        strokeWidth="5"
        aria-hidden="true"
      >
        <path d="M30 28c-3 5-17 6-19-6C8 9 26 6 29 18l-18 4" />
      </svg>
    );
  if (slug === "retell")
    return (
      <svg
        className={cls}
        viewBox="0 0 40 40"
        stroke="#9298FF"
        strokeWidth="4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {[12, 24, 32, 22, 12].map((h, i) => (
          <path key={i} d={"M" + (6 + i * 7) + " " + (20 - h / 2) + "v" + h} />
        ))}
      </svg>
    );
  if (slug === "freshdesk")
    return (
      <svg
        className={cls}
        viewBox="0 0 40 40"
        fill="none"
        stroke="#58D4A2"
        strokeWidth="4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M6 23v-4a14 14 0 0 1 28 0v4M6 19v9h7V18H8m26 1v9h-7V18h5m-5 9c0 6-4 8-10 8" />
        <circle cx="17" cy="35" r="2" fill="#58D4A2" stroke="none" />
      </svg>
    );
  if (slug === "slack")
    return (
      <svg
        className={cls}
        viewBox="0 0 40 40"
        strokeWidth="7"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M15 5v11M5 15h4" stroke="#36C5F0" />
        <path d="M35 15H24M25 5v4" stroke="#2EB67D" />
        <path d="M25 35V24M35 25h-4" stroke="#ECB22E" />
        <path d="M5 25h11M15 35v-4" stroke="#E01E5A" />
      </svg>
    );
  if (slug === "googleworkspace")
    return (
      <svg
        className={cls}
        viewBox="0 0 40 40"
        fill="none"
        strokeWidth="6"
        aria-hidden="true"
      >
        <path d="M31 10A14 14 0 0 0 10 10" stroke="#EA4335" />
        <path d="M10 10A14 14 0 0 0 7 25" stroke="#FBBC05" />
        <path d="M7 25a14 14 0 0 0 24 5" stroke="#34A853" />
        <path d="M31 30c3-3 4-6 3-11H21" stroke="#4285F4" />
      </svg>
    );
  return (
    <svg className={cls} viewBox="0 0 40 40" aria-hidden="true">
      <path d="m14 10 20-8-9 33H14l6-21-9 4Z" fill="#528FF0" />
      <path d="m7 22 10-4-5 17H3Z" fill="#B7D1FF" />
    </svg>
  );
}
