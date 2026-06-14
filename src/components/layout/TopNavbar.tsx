'use client';

import { Settings, Download, Upload, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrackerStore } from '@/store/useTrackerStore';
import { useHydration } from '@/hooks/useHydration';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TopNavbar() {
  const hydrated = useHydration();
  const store = useTrackerStore();

  const handleExport = () => {
    if (!hydrated) return;
    const dataStr = JSON.stringify(store);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'system-design-tracker-backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          store.importData(json);
        } catch (err) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      store.resetAll();
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4 lg:hidden">
        <h1 className="text-lg font-bold bg-gradient-to-br from-indigo-400 to-purple-600 bg-clip-text text-transparent">
          SD Tracker
        </h1>
      </div>
      
      <div className="hidden lg:flex flex-1"></div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9">
            <Settings className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Data Management</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              <span>Export Progress</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => document.getElementById('import-file-upload')?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              <span>Import Progress</span>
              <input id="import-file-upload" type="file" accept=".json" className="hidden" onChange={handleImport} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleReset} className="text-destructive focus:bg-destructive/10">
              <RotateCcw className="mr-2 h-4 w-4" />
              <span>Reset All</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
