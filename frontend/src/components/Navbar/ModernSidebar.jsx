import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const ModernSidebar = ({ navLinks, userName }) => {
    const [openSections, setOpenSections] = useState([]);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    const toggleSection = (title) => {
        setOpenSections(prev =>
            prev.includes(title)
                ? prev.filter(section => section !== title)
                : [...prev, title]
        );
    };

    const isActive = (link) => {
        if (link === '#') return false;
        return location.pathname === link || location.pathname === `/${link}`;
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed top-6 left-6 z-50 p-3 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
                <Menu className="h-5 w-5 text-slate-700" />
            </button>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-full w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transform transition-all duration-500 ease-out z-50 shadow-2xl",
                "md:relative md:transform-none md:block",
                isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                {/* Decorative background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl" />

                {/* Header */}
                <div className="relative p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1">
                                    <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Welcome Back
                                </h2>
                                {userName && (
                                    <p className="text-sm text-slate-300 font-medium">
                                        {userName}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="md:hidden p-2 hover:bg-slate-700/50 rounded-xl transition-colors duration-200"
                        >
                            <X className="h-5 w-5 text-slate-300" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="relative p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    {navLinks.map((section) => (
                        <div key={section.title} className="space-y-1">
                            <button
                                onClick={() => toggleSection(section.title)}
                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/30 transition-all duration-300 group border border-transparent hover:border-slate-600/30 hover:shadow-lg backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl flex items-center justify-center group-hover:from-blue-600/80 group-hover:to-purple-600/80 transition-all duration-300 shadow-lg">
                                        <section.icon className="h-5 w-5 text-slate-300 group-hover:text-white" />
                                    </div>
                                    <span className="font-semibold text-white group-hover:text-blue-100 transition-colors duration-300">
                                        {section.title}
                                    </span>
                                </div>
                                <ChevronDown className={cn(
                                    "h-5 w-5 text-slate-400 transition-all duration-300 group-hover:text-slate-200",
                                    openSections.includes(section.title) ? "rotate-180" : ""
                                )} />
                            </button>

                            {/* Collapsible Content */}
                            <div className={cn(
                                "overflow-hidden transition-all duration-500 ease-out",
                                openSections.includes(section.title)
                                    ? "max-h-96 opacity-100"
                                    : "max-h-0 opacity-0"
                            )}>
                                <div className="pl-4 space-y-1 py-2">
                                    {section.subtitle
                                        .filter(item => item.isActive)
                                        .map((item) => (
                                            <Link
                                                key={item.title}
                                                to={item.link || '#'}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-4 p-3 ml-2 rounded-xl transition-all duration-300 group relative overflow-hidden border border-transparent",
                                                    isActive(item.link || '#')
                                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 border-blue-400/30"
                                                        : "hover:bg-gradient-to-r hover:from-slate-700/40 hover:to-slate-600/20 text-slate-300 hover:text-white hover:shadow-lg hover:border-slate-600/30"
                                                )}
                                            >
                                                {/* Active indicator */}
                                                {isActive(item.link || '#') && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg animate-pulse" />
                                                )}

                                                <div className={cn(
                                                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                                                    isActive(item.link || '#')
                                                        ? "bg-white/20 shadow-lg"
                                                        : "bg-slate-600/50 group-hover:bg-blue-500/30"
                                                )}>
                                                    <item.icon className={cn(
                                                        "h-4 w-4 transition-colors duration-300",
                                                        isActive(item.link || '#')
                                                            ? "text-white"
                                                            : "text-slate-400 group-hover:text-blue-300"
                                                    )} />
                                                </div>

                                                <span className={cn(
                                                    "text-sm font-medium transition-colors duration-300",
                                                    isActive(item.link || '#') ? "text-white" : ""
                                                )}>
                                                    {item.title}
                                                </span>

                                                {/* Subtle shine effect for active items */}
                                                {isActive(item.link || '#') && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                )}
                                            </Link>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
                    <div className="text-xs text-slate-400 text-center font-medium">
                        © 2024 Modern Dashboard • Built with ❤️
                    </div>
                </div>
            </aside>
        </>
    );
};

export default ModernSidebar;