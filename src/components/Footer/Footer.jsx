import { PenLine } from "lucide-react";
import Container from "../Container/Container";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background py-8">
            <Container className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p className="inline-flex items-center gap-2 font-medium text-foreground"><PenLine size={16} className="text-indigo-600" /> Inkwell — thoughtful publishing, without the noise.</p>
                <p>© {new Date().getFullYear()} Inkwell. Built for independent ideas.</p>
            </Container>
        </footer>
    );
}
