// src/app/actions/fetchProfileData.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { toast } from "react-hot-toast";
import getUser from "./get-user";

export async function fetchProfileData() {
  const supabase = createClient();

  try {
    const{user,error} = await getUser();

    if (!user || error) {
      throw new Error("User not authenticated");
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("name, image_url, vip")
      .eq("id", user.id)
      .single();
    if (profileError) {
      throw profileError;
      
    }

    return {
      name: profileData.name,
        email: user.email || "",
      imageUrl: profileData.image_url || "",
      vipStatus: profileData.vip || "لا يوجد VIP",
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
}


export async function updateProfileData(userId: string, name: string, imageUrl: string, email: string, newPassword?: string) {
  const supabase = createClient();

  try {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ name, image_url: imageUrl })
      .eq("id", userId);

    if (profileError) {
      throw profileError;
    }

    const { error: authError } = await supabase.auth.updateUser({
      email,
      password: newPassword ? newPassword : undefined,
    });

    if (authError) {
      throw authError;
    }

    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
}


export async function updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const supabase = createClient();
  
    try {
      const { data, error } = await supabase
        .rpc("verify_user_password", { password: currentPassword });
  
      if (!data || error) {
        throw new Error("كلمة المرور الحالية غير صحيحة");
      }
  
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
  
      if (updateError) {
        throw updateError;
      }
  
      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      return false;
    }
  }

export async function uploadProfileImage(userId: string, file: File) {
    const supabase = createClient();
  
    try {
      const filePath = `${userId}/${file.name}`;
  
      const { data, error } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, file);
  
      if (error) {
        throw error;
      }
  
      const url = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(data.path).data.publicUrl;
  
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  }