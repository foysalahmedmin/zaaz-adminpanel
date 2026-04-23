import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { TContact } from "@/types/contact.type";
import { Mail, User, X } from "lucide-react";

type Props = {
  contact: TContact;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
};

const ContactViewModal = ({ contact, isOpen, setIsOpen }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg">
        <Card.Header className="flex flex-row items-center justify-between border-b">
          <h2 className="text-lg font-semibold">Contact Message</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </Card.Header>
        <Card.Content className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{contact.name}</p>
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <Mail className="h-3.5 w-3.5" />
                {contact.email}
              </p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">Subject</p>
            <p className="font-medium">{contact.subject}</p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">Message</p>
            <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">{contact.message}</p>
          </div>

          {contact.created_at && (
            <p className="text-muted-foreground text-xs">
              Received: {new Date(contact.created_at).toLocaleString()}
            </p>
          )}
        </Card.Content>
        <Card.Footer className="border-t">
          <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ContactViewModal;
