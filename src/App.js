import Welcome from "./components/Welcome";
import ErrorBoundary from "./components/errors/ErrorBoundary";
import RenderNotAllowed from "./components/errors/RenderNotAllowed";
import { useState, useEffect, lazy, Suspense } from "react";
import useLoader from "./hooks/useLoader";
import useRenderAllowed from "./hooks/useRenderAllowed";
import RoomProvider from "./contexts/RoomProvider";
import ActionProvider from "./contexts/ActionProvider";
import GlobalSettingsProvider from "./contexts/GlobalSettingsProvider";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAuth0 } from "@auth0/auth0-react";

const Main = lazy(() => import("./views/Main"));

function App() {
  const [guest, setGuest] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const loader = useLoader();
  const renderAllowed = useRenderAllowed();

  useEffect(() => {
    if (!user) return;
    console.log(user);
  }, [user]);

  if (!renderAllowed) return <RenderNotAllowed />;

  if (renderAllowed) {
    if (isLoading) return <p>Loading...</p>;

    return (
      <div className="App">
        {!isAuthenticated && !guest && (
          <Welcome guestLogin={() => setGuest(true)} />
        )}
        {(isAuthenticated || guest) && (
          <Suspense fallback={loader}>
            <ErrorBoundary>
              <GlobalSettingsProvider>
                <ActionProvider>
                  <DndProvider backend={HTML5Backend}>
                    <RoomProvider>
                      <Main />
                    </RoomProvider>
                  </DndProvider>
                </ActionProvider>
              </GlobalSettingsProvider>
            </ErrorBoundary>
          </Suspense>
        )}
      </div>
    );
  }
}

export default App;
