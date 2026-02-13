import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { cn } from "../lib/utils"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setTheme("light")}
                className={cn(
                    "p-2 rounded-md transition-all",
                    theme === "light"
                        ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                )}
                title="Light Mode"
            >
                <Sun className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={cn(
                    "p-2 rounded-md transition-all",
                    theme === "system"
                        ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                )}
                title="System Preference"
            >
                <Monitor className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={cn(
                    "p-2 rounded-md transition-all",
                    theme === "dark"
                        ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                )}
                title="Dark Mode"
            >
                <Moon className="h-4 w-4" />
            </button>
        </div>
    )
}
