import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { UserIcon } from "@heroicons/react/24/outline";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../services/userService";
import { toast } from "sonner";
import type { ProfileErrors, UserProfile } from "../../types/components/user.types";

const UserProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile["profile"]>(
    {} as UserProfile["profile"]
  );
   const [originalProfile, setOriginalProfile] = useState<
    UserProfile["profile"] | null
  >(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [errors, setErrors] = useState<ProfileErrors>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const result = await fetchUserProfile();
      if (result.data) {
        setProfile(result.data.profile);
        setOriginalProfile(result.data.profile)
        if (result.data.profile.profilePicture)
          setPreviewUrl(result.data.profile.profilePicture);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (profile?.profilePicture && profile.profilePicture instanceof File) {
      const url = URL.createObjectURL(profile.profilePicture);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (
      profile?.profilePicture &&
      typeof profile.profilePicture === "string"
    ) {
      setPreviewUrl(profile.profilePicture);
    } else {
      setPreviewUrl("");
    }
  }, [profile?.profilePicture]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prev) => (prev ? { ...prev, profilePicture: file } : prev));
    }
  };

  // ---------------- VALIDATION FUNCTION ----------------
  const validateProfile = (data: UserProfile["profile"]) => {
    const newErrors: ProfileErrors = {};

    if (!data.firstName?.trim()) newErrors.firstName = "First name is required.";
    if (!data.lastName?.trim()) newErrors.lastName = "Last name is required.";
    if (data.gender && !["male", "female", "others"].includes(data.gender))
      newErrors.gender = "Invalid gender selected.";
    if (data.dob) {
      const date = new Date(data.dob);
      if (isNaN(date.getTime())) newErrors.dob = "Invalid date format.";
      else if (date > new Date())
        newErrors.dob = "Date of birth cannot be in the future.";
    }

    return newErrors;
  }

const handleSave = async () => {
    if (!profile || !originalProfile) return;

    const validationErrors = validateProfile(profile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();

      const changedFields = Object.keys(profile).filter((key) => {
        const field = key as keyof UserProfile["profile"];
        if (field === "email") return false; 
        const current = profile[field];
        const original = originalProfile[field];

        if (current instanceof File || original instanceof File)
          return current !== original;

        return JSON.stringify(current) !== JSON.stringify(original);
      });

      if (changedFields.length === 0) {
        toast("No changes detected.");
        setIsEditing(false);
        return;
      }

      changedFields.forEach((field) => {
        const key = field as keyof UserProfile["profile"];
        const value = profile[key];
        if (key === "dob" && value)
          formData.append("dob", new Date(value as string).toISOString());
        else if (value !== undefined && value !== null)
          formData.append(key, value as any);
      });

      const result = await updateUserProfile(formData);
      if (result.data) {
        toast(result.data.message);
        setIsEditing(false);
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Profile Top Section */}
      <Card className="p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center relative">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-16 h-16 text-gray-400" />
          )}
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="absolute bottom-0 left-0 w-full opacity-0 h-full cursor-pointer"
              title="Click to upload new profile picture"
            />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName || ""}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="px-2 py-1 rounded border text-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName || ""}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="px-2 py-1 rounded border text-gray-800 dark:text-white"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {profile.firstName} {profile.lastName}
              </h2>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {profile.email}
          </p>

          {/* Gender */}
          <div>
            {isEditing ? (
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={profile.gender || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile.gender
                  ? profile.gender.charAt(0).toUpperCase() +
                    profile.gender.slice(1)
                  : "Gender not specified"}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            {isEditing ? (
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={
                    profile.dob
                      ? new Date(profile.dob).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white text-sm"
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile.dob
                  ? new Date(profile.dob).toLocaleDateString()
                  : "Date of Birth not specified"}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Profile Details Section */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Profile Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Address
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="address"
                  value={profile.address || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white text-sm"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </>
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile.address || "-"}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfilePage;
