import React from "react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/AccountSidebar";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "../services/queries/profile";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const { data, isLoading } = useProfileQuery();
  const updateMutation = useUpdateProfileMutation();

  const profile = data?.data;

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  React.useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  const handleOpenDialog = () => {
    if (profile) {
      setName(profile.name ?? "");
      setPhone(profile.phone ?? "");
      setCurrentPassword("");
      setNewPassword("");
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Name dan phone wajib diisi.");
      return;
    }

    if (newPassword && !currentPassword) {
      toast.error("Masukkan current password untuk mengganti password.");
      return;
    }

    updateMutation.mutate(
      {
        name: name.trim(),
        phone: phone.trim(),
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Profile updated.");
          setDialogOpen(false);
          setCurrentPassword("");
          setNewPassword("");
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message || "Failed to update profile.";
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar variant="solid" />

      <main className="mx-auto mt-24 mb-16 flex w-full max-w-6xl flex-col gap-6 px-4 md:flex-row">
        <AccountSidebar />

        <section className="flex-1">
          <h1 className="text-lg font-semibold text-slate-900">Profile</h1>

          <div className="mt-4 rounded-3xl bg-white p-6 shadow-sm">
            {isLoading && (
              <p className="text-xs text-slate-500">Loading profile...</p>
            )}

            {!isLoading && profile && (
              <>
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                      {profile ? profile.name.charAt(0).toUpperCase() : ""}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Name</span>
                    <span className="font-medium text-slate-900">
                      {profile.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium text-slate-900">
                      {profile.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Nomor Handphone</span>
                    <span className="font-medium text-slate-900">
                      {profile.phone}
                    </span>
                  </div>
                </div>

                <Button
                  className="mt-6 w-full rounded-full bg-red-600 text-sm font-medium hover:bg-red-700"
                  onClick={handleOpenDialog}
                >
                  Update Profile
                </Button>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl p-0">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <DialogTitle className="text-base font-semibold text-slate-900">
              Update Profile
            </DialogTitle>
          </div>

          <div className="px-6 pb-6 pt-4 space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="text-xs font-medium text-slate-700"
              >
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 h-9 rounded-2xl border-slate-200 text-xs"
              />
            </div>

            <div>
              <Label
                htmlFor="phone"
                className="text-xs font-medium text-slate-700"
              >
                Nomor Handphone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 h-9 rounded-2xl border-slate-200 text-xs"
              />
            </div>

            <div className="pt-2">
              <Label
                htmlFor="currentPassword"
                className="text-xs font-medium text-slate-700"
              >
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 h-9 rounded-2xl border-slate-200 text-xs"
              />
            </div>

            <div>
              <Label
                htmlFor="newPassword"
                className="text-xs font-medium text-slate-700"
              >
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 h-9 rounded-2xl border-slate-200 text-xs"
              />
            </div>

            <Button
              className="mt-4 w-full rounded-full bg-red-600 text-sm font-medium hover:bg-red-700"
              onClick={handleSubmit}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
