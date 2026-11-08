import { BrowserRouter, Route, Routes } from 'react-router';
import { AppShell } from './components/layout/AppShell';
import { AssistantProvider } from './components/assistant/AssistantProvider';
import { TripsProvider } from './state/TripsProvider';
import { SavedProvider } from './state/SavedProvider';
import { ExploreHome } from './screens/ExploreHome';
import { MyTrips } from './screens/MyTrips';
import { TripDetail } from './screens/TripDetail';
import { Saved } from './screens/Saved';
import { PlaceholderScreen } from './screens/PlaceholderScreen';

export function App() {
  return (
    <BrowserRouter>
      <TripsProvider>
        <SavedProvider>
          <AssistantProvider>
            <AppShell>
              <Routes>
                <Route index element={<ExploreHome />} />
                <Route path="trips" element={<MyTrips />} />
                <Route path="trips/:tripId" element={<TripDetail />} />
                <Route path="saved" element={<Saved />} />
                <Route path="profile" element={<PlaceholderScreen screen="profile" />} />
                <Route path="*" element={<PlaceholderScreen screen="notFound" />} />
              </Routes>
            </AppShell>
          </AssistantProvider>
        </SavedProvider>
      </TripsProvider>
    </BrowserRouter>
  );
}
