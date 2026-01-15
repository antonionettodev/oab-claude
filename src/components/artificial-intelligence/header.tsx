import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles } from 'lucide-react'

export function AIHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl px-4 py-2.5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-foreground">IA Jurídica</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
