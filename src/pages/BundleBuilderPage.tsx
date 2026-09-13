import React, { useEffect } from 'react';
import { BundleBuilderSection } from '../components/BundleBuilderSection';

export const BundleBuilderPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="bundle-builder-page" className="min-h-screen bg-[#F5F2EC]">
      <BundleBuilderSection isStandalonePage={true} />
    </div>
  );
};
