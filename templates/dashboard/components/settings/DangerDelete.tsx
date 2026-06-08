"use client";

import { useState } from "react";
import { Button, Modal, notification } from "@atomizeui/core";

interface Props {
  label: string;
  modalTitle: string;
  modalBody: React.ReactNode;
  notificationMessage: string;
  notificationDescription: string;
}

/**
 * Destructive button + confirmation modal + notification. Self-contained:
 * the rest of the page doesn't need to know this trigger exists.
 */
export function DangerDelete({
  label,
  modalTitle,
  modalBody,
  notificationMessage,
  notificationDescription,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <Button danger onClick={() => setConfirming(true)}>
        {label}
      </Button>
      <Modal
        open={confirming}
        title={modalTitle}
        okText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirming(false)}
        onOk={() => {
          setConfirming(false);
          notification.error({
            message: notificationMessage,
            description: notificationDescription,
            duration: 6,
          });
        }}
      >
        {modalBody}
      </Modal>
    </>
  );
}
