"use client";

import { ImageManager, type ServerImage } from "@atomizeui/core";
import { mediaAdapter } from "@/lib/media-mock";

/**
 * Coordinated island. The ImageManager is a heavy client component
 * (drag&drop, modals, file upload), so the whole interactive surface
 * sits inside one island. The page's stat cards above stay server-side.
 */
export function MediaSection() {
  const onImageOpen = (img: ServerImage) => {
    window.open(img.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="media-manager-card">
      <ImageManager
        rootDir=""
        mode="edit"
        multiple
        actions={mediaAdapter}
        defaultView="grid"
        itemSize="lg"
        itemMinWidth={240}
        height="calc(100vh - 280px)"
        onImageOpen={onImageOpen}
        accept="image/*"
        maxFileSize={8 * 1024 * 1024}
      />
    </div>
  );
}
