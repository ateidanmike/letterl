import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { b as useTheme } from "./router-BZ24CEhc.mjs";
import { u as Sun, v as Moon } from "../_libs/lucide-react.mjs";
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: toggle, "aria-label": "Toggle theme", children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" }) });
}
export {
  ThemeToggle as T
};
