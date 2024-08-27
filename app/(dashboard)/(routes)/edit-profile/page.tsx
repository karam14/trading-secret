"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProfileData,updateProfileData, updatePassword, uploadProfileImage } from "@/actions/profile-actions"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { ArrowRight, Camera, ChevronDown, Edit, Eye, EyeOff } from "lucide-react";
import getUser from "@/actions/get-user";
import { createClient } from "@/utils/supabase/client";
import { get } from "http";

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [vipStatus, setVipStatus] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Preload profile data
  useEffect(() => {
    async function loadProfileData() {
      const profileData = await fetchProfileData();
      if (profileData) {
        setName(profileData.name);
        setImageUrl(profileData.imageUrl);
        setVipStatus(profileData.vipStatus);
        setEmail(profileData.email);
      }
    }

    loadProfileData();
  }, []);
  const supabase = createClient();

  const handleFileUpload = async (event: any) => {

    const file = event.target.files[0];
    if (file) {
        try {
            
            const {user, error: userError} = await getUser();
            const userId = user?.id;
            const filePath = `${userId}/${file.name}`;
                  // Check if the user already has an image
      const { data: list, error: listError } = await supabase.storage
      .from("profile-pictures")
      .list(userId);

    if (listError) {
      throw listError;
    }

    // Delete old image if it exists
    if (list && list.length > 0) {
      for (const file of list) {
        await supabase.storage
          .from("profile-pictures")
          .remove([`${userId}/${file.name}`]);
      }
    }
            setLoading(true);


            const { data, error } = await supabase.storage
                .from("profile-pictures")
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            const url = supabase.storage
                .from("profile-pictures")
                .getPublicUrl(data.path).data.publicUrl;

            setImageUrl(url || "");
            await supabase.from("profiles").update({ image_url: url }).eq("id", userId);
            setLoading(false);
            toast.success("تم رفع الصورة بنجاح");

        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("حدث خطأ أثناء رفع الصورة");
            setLoading(false);
        }
    }
};
  const handleBack = () => {
    router.back(); // Navigate the user back to the previous page
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) { // Removed imageUrl from this check
      toast.error("يرجى تعبئة كافة الحقول");
      return;
    }

    setLoading(true);
    const {user,error: UserError} = await getUser();
    const userId = user?.id as string;
    const success = await updateProfileData(userId, name, imageUrl, email, newPassword);
    setLoading(false);

    if (success) {
      router.push("/");
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("يرجى تعبئة كلا الحقلين");
      return;
    }

    setLoading(true);
    const {user, error} = await getUser();
    const userId = user?.id as string;
    const success = await updatePassword(userId, currentPassword, newPassword);
    setLoading(false);

    if (success) {
      router.push("/");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 shadow rounded-md text-right">
      {/* Return Button */}
      <div className="mb-4">
        <Button variant="ghost" onClick={handleBack}>
          العودة
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">تعديل الملف الشخصي</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            الاسم
          </label>
          <Input
            type="text"
            placeholder="أدخل اسمك"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            البريد الإلكتروني
          </label>
          <Input
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            الحالة VIP
          </label>
          <Input
            type="text"
            value={vipStatus === true ? " VIPانت عضو" : " VIP لا يوجد"}
            disabled
            className="bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
          />
        </div>
        <div className="mb-4 flex flex-col items-end">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            الصورة الشخصية
          </label>
          <div className="relative w-16 h-16 rounded-full overflow-hidden group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="upload"
            />
            <label
              htmlFor="upload"
              className="cursor-pointer flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="الصورة الشخصية"
                  className="object-cover w-full h-full"
                />
              ) : (
                <Camera className="text-gray-500 dark:text-gray-400 w-6 h-6" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit className="w-6 h-6" />
              </div>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full">
                  جاري الرفع...
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Password Section Dropdown */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="flex items-center justify-between w-full text-gray-700 dark:text-gray-300 mb-2 focus:outline-none"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${showPasswordFields ? "transform rotate-180" : ""}`}
            />
            <span className="text-right">تحديث كلمة المرور</span>
          </button>
          {showPasswordFields && (
            <div className="space-y-4 text-right">
              <div className="relative">
                <Input
                  className="text-right pr-10"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور الحالية"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 left-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>
              <div className="relative">
                <Input
                  className="text-right pr-10"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور الجديدة"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 left-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handlePasswordChange}
                disabled={loading}
              >
                {loading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "جارٍ التحديث..." : "تحديث الملف الشخصي"}
          </Button>
        </div>
      </form>
    </div>
  );
}
