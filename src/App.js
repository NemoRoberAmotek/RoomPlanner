import Welcome from "./components/Welcome";
import ErrorBoundary from "./components/errors/ErrorBoundary";
import RenderNotAllowed from "./components/errors/RenderNotAllowed";
import { lazy, Suspense } from "react";
import useLoader from "./hooks/useLoader";
import useRenderAllowed from "./hooks/useRenderAllowed";
import RoomProvider from "./contexts/RoomProvider";
import ActionProvider from "./contexts/ActionProvider";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Message from "./components/Message";

const Main = lazy(() => import("./views/Main"));

function App() {
  const loader = useLoader();
  const renderAllowed = useRenderAllowed();

  if (!renderAllowed) return <RenderNotAllowed />;

  if (renderAllowed) {
    return (
      <div className="App">
        <Message />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/room/:id"
            element={
              <Suspense fallback={loader}>
                <ErrorBoundary>
                  <ActionProvider>
                    <DndProvider backend={HTML5Backend}>
                      <RoomProvider>
                        <Main />
                      </RoomProvider>
                    </DndProvider>
                  </ActionProvider>
                </ErrorBoundary>
              </Suspense>
            }
          />
        </Routes>
      </div>
    );
  }
}

export default App;
