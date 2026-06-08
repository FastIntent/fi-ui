"use client";

import { useState } from "react";
import { Option, Select, Switch } from "@atomizeui/core";

const DIGEST_TIMES = ["07:00", "08:00", "09:00", "10:00", "12:00", "18:00"];

/**
 * Coupled island: `digest` enabled controls whether `digestTime` is
 * pickable. Two atoms that share gating logic — single tiny island
 * instead of two with prop-drilled state.
 */
export function DigestPicker() {
  const [digest, setDigest] = useState(true);
  const [digestTime, setDigestTime] = useState("09:00");

  return (
    <>
      <div className="settings-row">
        <div className="settings-row-text">
          <div className="settings-row-label">Daily digest</div>
          <div className="settings-row-description">
            A single email each morning with everything that didn&apos;t ping you in real-time.
          </div>
        </div>
        <div className="settings-row-control">
          <Switch checked={digest} onChange={setDigest} />
        </div>
      </div>
      <div className="settings-row">
        <div className="settings-row-text">
          <div className="settings-row-label">Digest time</div>
          <div className="settings-row-description">Local time the digest lands in your inbox.</div>
        </div>
        <div className="settings-row-control">
          <Select
            value={digestTime}
            onChange={(v) => setDigestTime(v as string)}
            style={{ width: 160 }}
            disabled={!digest}
          >
            {DIGEST_TIMES.map((t) => (
              <Option key={t} value={t}>
                {t}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
}
