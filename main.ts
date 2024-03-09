import { Editor, Notice, Plugin } from 'obsidian';

export default class TimedJournalPlugin extends Plugin {
    timedJournalEnabled = false;
    lastLineContent = "";

    async onload() {
        this.addCommand({
            id: 'toggle-timed-journal',
            name: 'Toggle Timed Journal',
            callback: () => {
                this.timedJournalEnabled = !this.timedJournalEnabled;
                new Notice(`Timed Journal ${this.timedJournalEnabled ? 'enabled' : 'disabled'}.`);
            }
        });

        this.registerEvent(this.app.workspace.on('editor-change', (editor) => {
            const currentLineContent = this.getCurrentLineContent(editor);
            if (currentLineContent.trim() === '/timed') {
                this.timedJournalEnabled = !this.timedJournalEnabled;
                editor.replaceRange('', {line: editor.getCursor().line, ch: 0}, {line: editor.getCursor().line, ch: '/timed'.length}); // Remove the command text
                new Notice(`Timed Journal ${this.timedJournalEnabled ? 'enabled' : 'disabled'}.`);
            } else if (this.timedJournalEnabled) {
                this.injectTime(editor);
            }
            this.lastLineContent = currentLineContent;
        }));
    }

    getCurrentLineContent(editor: Editor): string {
        const cursor = editor.getCursor();
        return editor.getLine(cursor.line);
    }

    injectTime(editor: Editor) {
        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line);

        if (line.length === 0) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            const formattedString = '**' + timeString + '** — ';
            editor.replaceRange(formattedString, { line: cursor.line, ch: 0 });
            editor.setCursor({ line: cursor.line, ch: formattedString.length });
        }
    }
}
