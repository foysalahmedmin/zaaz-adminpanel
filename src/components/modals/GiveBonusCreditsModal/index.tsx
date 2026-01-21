import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { giveBonusCredits } from "@/services/user-wallet.service";
import type { TUserWallet } from "@/types/user-wallet.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Coins, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface GiveBonusCreditsModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  wallet: TUserWallet;
}

const GiveBonusCreditsModal = ({
  isOpen,
  setIsOpen,
  wallet,
}: GiveBonusCreditsModalProps) => {
  const queryClient = useQueryClient();
  const [creditsAmount, setCreditsAmount] = useState<string>("");

  // Extract user info
  const userId = wallet.user;
  const userEmail = wallet.email;
  const userName = wallet.email || "User";

  const mutation = useMutation({
    mutationFn: giveBonusCredits,
    onSuccess: (data) => {
      toast.success(data?.message || "Bonus credits added successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["user-wallets"] });
      queryClient.invalidateQueries({ queryKey: ["credits-transactions"] });
      setIsOpen(false);
      setCreditsAmount("");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to add bonus credits",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const credits = Number.parseInt(creditsAmount);

    if (!credits || credits <= 0) {
      toast.error("Please enter a valid credit amount (greater than 0)");
      return;
    }

    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    mutation.mutate({
      user_id: userId,
      credits: credits,
      email: userEmail,
    });
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      setIsOpen(false);
      setCreditsAmount("");
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={handleClose}>
      <Modal.Backdrop>
        <Modal.Content className="max-w-md">
          <Modal.Header>
            <Modal.Title className="flex items-center gap-2">
              <Coins className="text-primary h-5 w-5" />
              Give Bonus Credits
            </Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit}>
            <Modal.Body className="space-y-4">
              {/* User Info */}
              <div className="bg-muted rounded-lg p-4">
                <div className="text-muted-foreground text-sm">User</div>
                <div className="text-foreground font-semibold">{userName}</div>
                {userEmail && (
                  <div className="text-muted-foreground text-xs">
                    {userEmail}
                  </div>
                )}
              </div>

              {/* Current Balance */}
              <div className="bg-muted rounded-lg p-4">
                <div className="text-muted-foreground text-sm">
                  Current Balance
                </div>
                <div className="text-foreground text-2xl font-bold">
                  {wallet.credits || 0} credits
                </div>
              </div>

              {/* Credit Amount Input */}
              <div>
                <FormControl.Label>
                  Bonus Credits Amount <span className="text-red-500">*</span>
                </FormControl.Label>
                <FormControl
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter credit amount (e.g., 100)"
                  value={creditsAmount}
                  onChange={(e) => setCreditsAmount(e.target.value)}
                  disabled={mutation.isPending}
                  required
                />
                <FormControl.Helper>
                  Enter the number of bonus credits to add to this wallet
                </FormControl.Helper>
              </div>

              {/* Preview */}
              {creditsAmount && Number.parseInt(creditsAmount) > 0 && (
                <div className="bg-primary/10 border-primary/20 rounded-lg border p-4">
                  <div className="text-muted-foreground text-sm">
                    New Balance
                  </div>
                  <div className="text-primary text-xl font-bold">
                    {(wallet.credits || 0) + Number.parseInt(creditsAmount)}{" "}
                    credits
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    +{creditsAmount} bonus credits
                  </div>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Coins className="mr-2 h-4 w-4" />
                    Add Bonus Credits
                  </>
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default GiveBonusCreditsModal;
