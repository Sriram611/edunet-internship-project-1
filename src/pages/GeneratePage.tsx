/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Sidebar from '../components/Sidebar';
import MainCanvas from '../components/MainCanvas';
import RightPanel from '../components/RightPanel';

export default function GeneratePage() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Center Canvas */}
      <MainCanvas />

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
}
