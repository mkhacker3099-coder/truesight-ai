export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

const PROFILE_KEY = "deepfake_user_profile";

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  email: "",
  avatar: "",
};

export const getProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};
