import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: React.ReactNode;
  getContainer?: () => HTMLElement;
}

export const Portal: React.FC<PortalProps> = ({ children, getContainer }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const parent = getContainer ? getContainer() : document.body;
    setContainer(parent);
  }, [getContainer]);

  if (!container) return null;

  return createPortal(children, container);
};
