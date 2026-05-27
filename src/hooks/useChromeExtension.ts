import { useState, useEffect } from 'react';

export function useChromeExtension() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the extension is installed
    // For prototype, we can just return false or check a specific window property
    setIsInstalled(!!(window as any).careerCopilotExtension);
  }, []);

  return { isInstalled };
}
