import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { UserIcon } from "@heroicons/react/24/outline";
import {
  fetchPsychProfile,
  updatePsychProfile,
} from "../../services/psychologistService";
import { toast } from "sonner";
import type {
  ProfileErrors,
  PsychProfile,
} from "../../types/components/psychologist.types"; 

const PsychologistProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<PsychProfile["profile"]>(
    {} as PsychProfile["profile"]
  );
  const [originalProfile, setOriginalProfile] = useState<
    PsychProfile["profile"] | null
  >(null); 
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [errors, setErrors] = useState<ProfileErrors>({}); 

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const result = await fetchPsychProfile();
      if (result.data) {
        setProfile(result.data.profile);
        setOriginalProfile(result.data.profile); 
        if (result.data.profile.profilePicture)
          setPreviewUrl(result.data.profile.profilePicture);
      }
    } catch (error) {
      console.log(error);
    }
  }

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        profilePicture: file,
      }));
    }
  };

  const validateProfile = (data: PsychProfile["profile"]) => {
    const newErrors: ProfileErrors = {};

    
    if (data.gender && !["male", "female", "others"].includes(data.gender))
      newErrors.gender = "Invalid gender selected.";

    if (data.dob) {
      const date = new Date(data.dob);
      if (isNaN(date.getTime())) newErrors.dob = "Invalid date format.";
      else if (date > new Date())
        newErrors.dob = "Date of birth cannot be in the future.";
    }

    if (!data.address?.trim())
      newErrors.address = "Address is required.";

    if (!data.languages?.trim())
      newErrors.languages = "Languages field is required.";

    if (
      !data.specializations ||
      !Array.isArray(data.specializations) ||
      data.specializations.length === 0
    )
      newErrors.specializations = "At least one specialization is required.";

    if (!data.qualifications?.trim())
      newErrors.qualifications = "Qualifications are required.";

    if (!data.hourlyFees || data.hourlyFees <= 0)
      newErrors.hourlyFees = "Hourly fees must be greater than zero.";
    if (!data.bio?.trim())
      newErrors.bio = "Bio cannot be empty.";

    return newErrors;
  };

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
        const field = key as keyof PsychProfile["profile"];
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
        const key = field as keyof PsychProfile["profile"];
        const value = profile[key];
        if (key === "dob" && value){
          formData.append("dob", new Date(value as string).toISOString());
        }else if(value !== undefined && value !== null){
          formData.append(
            key,
            key === "specializations" && Array.isArray(value)
              ? JSON.stringify(value)
              : (value as any)
          );
        }
      });

      const result = await updatePsychProfile(formData);
      if (result.data) {
        toast.success(result.data.message);
        setIsEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
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
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {profile.firstName} {profile.lastName}
              </h2>

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

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {profile.gender
              ? profile.gender.charAt(0).toUpperCase() +
                profile.gender.slice(1)
              : "Gender not specified"}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {profile.dob
              ? new Date(profile.dob).toLocaleDateString()
              : "Date of Birth not specified"}
          </p>
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
                  className="w-full px-3 py-2 rounded-lg glass-card border text-gray-800 dark:text-white text-sm"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </>
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile.address || "-"}
              </p>
            )}
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Languages
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="languages"
                  value={profile.languages || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg glass-card border text-gray-800 dark:text-white text-sm"
                />
                {errors.languages && (
                  <p className="text-red-500 text-sm">{errors.languages}</p>
                )}
              </>
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile.languages || "-"}
              </p>
            )}
          </div>

          {/* Specializations */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Specializations
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="specializations"
                  value={profile.specializations?.join(", ") || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      specializations: e.target.value
                        .split(",")
                        .map((s) => s.trim()),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg glass-card border text-gray-800 dark:text-white text-sm"
                />
                {errors.specializations && (
                  <p className="text-red-500 text-sm">
                    {errors.specializations}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile.specializations?.join(", ") || "-"}
              </p>
            )}
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Qualifications
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="qualifications"
                  value={profile.qualifications || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg glass-card border text-gray-800 dark:text-white text-sm"
                />
                {errors.qualifications && (
                  <p className="text-red-500 text-sm">
                    {errors.qualifications}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile.qualifications || "-"}
              </p>
            )}
          </div>

          {/* Hourly Fees */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Hourly Fees
            </label>
            {isEditing ? (
              <>
                <input
                  type="number"
                  name="hourlyFees"
                  value={profile.hourlyFees || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg glass-card border text-gray-800 dark:text-white text-sm"
                />
                {errors.hourlyFees && (
                  <p className="text-red-500 text-sm">{errors.hourlyFees}</p>
                )}
              </>
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile.hourlyFees ? `INR ${profile.hourlyFees}` : "-"}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Bio
            </label>
            {isEditing ? (
              <>
                <textarea
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg glass-card border text-gray-800 dark:text-white text-sm resize-none"
                  rows={4}
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio}</p>
                )}
              </>
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile.bio || "-"}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PsychologistProfile;
