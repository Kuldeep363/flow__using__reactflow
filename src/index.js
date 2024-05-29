import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Flow from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Flow />
  </StrictMode>
);
