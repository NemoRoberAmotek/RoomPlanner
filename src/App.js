import Welcome from "./components/Welcome";
import ErrorBoundary from "./components/errors/ErrorBoundary";
import RenderNotAllowed from "./components/errors/RenderNotAllowed";
import { useState, lazy, Suspense } from "react";
import useLoader from "./hooks/useLoader";
import useRenderAllowed from "./hooks/useRenderAllowed";
import RoomProvider from "./contexts/RoomProvider";
import ActionProvider from "./contexts/ActionProvider";
import GlobalSettingsProvider from "./contexts/GlobalSettingsProvider";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Main = lazy(() => import("./views/Main"));

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const loader = useLoader();
  const renderAllowed = useRenderAllowed();

  if (!renderAllowed) return <RenderNotAllowed />;

  if (renderAllowed)
    return (
      <div className="App">
        {!loggedIn && <Welcome login={() => setLoggedIn(true)} />}
        {loggedIn && (
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

export default App;
