/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from "./components/Navbar";
import { Scrollytell } from "./components/Scrollytell";

export default function App() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <Scrollytell />
      <div className="relative z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
      </div>
    </main>
  );
}

