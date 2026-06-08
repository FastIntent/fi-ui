"use client";

import { useState } from "react";
import { Button, Modal, notification } from "@atomizeui/core";

interface Props {
  name: string;
  initiallyConnected: boolean;
}

/**
 * Self-contained connect/disconnect flow. Owns its own local state
 * (connection + confirmation modal) so each card can ship its toggle
 * independently. The surrounding grid stays fully server-rendered.
 */
export function IntegrationToggle({ name, initiallyConnected }: Props) {
  const [connected, setConnected] = useState(initiallyConnected);
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (connected) {
      setConfirming(true);
      return;
    }
    setConnected(true);
    notification.success({
      message: `${name} connected`,
      description: `Data from ${name} will start flowing into your workspace within a few minutes.`,
    });
  };

  const handleConfirmDisconnect = () => {
    setConnected(false);
    setConfirming(false);
    notification.warning({
      message: `${name} disconnected`,
      description: "Scheduled syncs were stopped. Existing data is kept until you delete it.",
    });
  };

  return (
    <>
      <Button type={connected ? "default" : "primary"} onClick={handleClick}>
        {connected ? "Disconnect" : "Connect"}
      </Button>
      <Modal
        open={confirming}
        title="Disconnect integration?"
        okText="Disconnect"
        cancelText="Cancel"
        onCancel={() => setConfirming(false)}
        onOk={handleConfirmDisconnect}
      >
        <p>
          Disconnecting <strong>{name}</strong> stops any scheduled syncs and removes the data this
          workspace receives from {name}. You can re-connect at any time.
        </p>
      </Modal>
    </>
  );
}
