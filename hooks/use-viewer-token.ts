// import { toast } from "sonner";
import { useEffect, useState } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { createViewerToken } from "@/utils/livekit/generateToken";
type CustomUser = {
    id: string;
    name: string;
    image_url: string | null;
  
  };
export const useViewerToken = (user : CustomUser, roomName: string) => {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");

  useEffect(() => {
    const createToken = async () => {
      try {
        const viewrToken = await createViewerToken(user, roomName);
        if(!viewrToken) {
            console.log("Token not created");
            throw new Error("Token not created");
        }
        else {
            console.log("Token created" ,viewrToken);
        }
        setToken(viewrToken);


      } catch (e) {
        toast.error("Failed to create token");
      }
    };

    createToken();
  }, [user]);

  return { token };
};