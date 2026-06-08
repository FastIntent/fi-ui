"use client";

import { Tooltip } from "@atomizeui/core";

interface Props {
  date: string;
  amount: string;
}

/**
 * Tooltip wrapper for the renewal date. Tooltip is portal-rendered and
 * needs hydration to position itself, so this small island handles it
 * without lifting the rest of the billing card into the client bundle.
 */
export function RenewsTooltip({ date, amount }: Props) {
  return (
    <Tooltip title={`Your card will be charged ${amount} on ${date}.`} placement="top">
      <span className="billing-plan-renewal" tabIndex={0}>
        Renews on {date}
      </span>
    </Tooltip>
  );
}
