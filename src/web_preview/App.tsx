import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { MoodFlowProvider } from './context/MoodFlowContext';
import { DevNav } from './components/DevNav';
import { Splash } from './screens/Splash';
import { Welcome } from './screens/Welcome';
import { Schedule } from './screens/Schedule';
import { AnchorMoods } from './screens/AnchorMoods';
import { Permission } from './screens/Permission';
import { Home } from './screens/Home';
import { CheckIn } from './screens/CheckIn';
import { IntentionModal } from './screens/Intention';
import { MoodShift } from './screens/MoodShift';
import { Breathe } from './screens/Breathe';
import { Recap } from './screens/Recap';
import { Settings } from './screens/Settings';

export default function App() {
  return (
    <MoodFlowProvider>
      <BrowserRouter>
        <div className="size-full flex items-center justify-center bg-[var(--background)]">
          <DevNav />
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/anchors" element={<AnchorMoods />} />
            <Route path="/permission" element={<Permission />} />
            <Route path="/home" element={<Home />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/intention" element={<IntentionModal />} />
            <Route path="/mood-shift" element={<MoodShift />} />
            <Route path="/breathe" element={<Breathe />} />
            <Route path="/recap" element={<Recap />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </MoodFlowProvider>
  );
}