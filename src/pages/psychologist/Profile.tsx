import React, { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { UserIcon } from "@heroicons/react/24/outline";
import {
  fetchPsychProfile,
  updatePsychProfile,
} from "../../services/psychologistService";
import { toast } from "sonner";
import type { PsychProfile } from "../../types/components/psychologist.types";

const PsychologistProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<PsychProfile["profile"]>(
    {} as PsychProfile["profile"]
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const result = await fetchPsychProfile();
      if (result.data) {
        console.log(result.data);
        setProfile(result.data.profile);
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  const handleSave = async () => {
    try {
      const formData = new FormData();

      if (profile.profilePicture) {
        formData.append("profilePicture", profile.profilePicture);
      }
      if (profile.address) formData.append("address", profile.address);
      if (profile.languages) formData.append("languages", profile.languages);
      if (profile.specializations)
        formData.append(
          "specializations",
          JSON.stringify(profile.specializations)
        );
      if (profile.bio) formData.append("bio", profile.bio);
      if (profile.hourlyFees !== undefined)
        formData.append("hourlyFees", profile.hourlyFees.toString());
      if (profile.quickSlotHourlyFees !== undefined)
        formData.append(
          "quickSlotHourlyFees",
          profile.quickSlotHourlyFees.toString()
        );
      if (profile.qualifications)
        formData.append("qualifications", profile.qualifications);
      const result = await updatePsychProfile(formData);
      if (result.data) {
        setIsEditing(false);
        toast(result.data.message);
        fetchProfile();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center relative">
          {profile?.profilePicture ? (
            <img
              src={
                typeof profile.profilePicture === "string"
                  ? profile.profilePicture
                  : URL.createObjectURL(profile.profilePicture)
              }
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
              {profile?.firstName} {profile?.lastName}
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
            {profile?.email}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {profile?.gender
              ? profile?.gender.charAt(0).toUpperCase() +
                profile?.gender.slice(1)
              : "Gender not specified"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {profile?.dob
              ? new Date(profile?.dob).toLocaleDateString()
              : "Date of Birth not specified"}
          </p>
        </div>
      </Card>

      {/* Profile details (same as before) */}
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
              <input
                type="text"
                name="address"
                value={profile?.address || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white text-sm"
              />
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile?.address || "-"}
              </p>
            )}
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Languages
            </label>
            {isEditing ? (
              <input
                type="text"
                name="languages"
                value={profile?.languages || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white text-sm"
              />
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile?.languages || "-"}
              </p>
            )}
          </div>

          {/* Specializations */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Specializations
            </label>
            {isEditing ? (
              <input
                type="text"
                name="specializations"
                value={profile?.specializations?.join(", ") || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    specializations: e.target.value
                      .split(",")
                      .map((s) => s.trim()),
                  }))
                }
                className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white text-sm"
              />
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile?.specializations?.join(", ") || "-"}
              </p>
            )}
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Qualifications
            </label>
            {isEditing ? (
              <input
                type="text"
                name="qualifications"
                value={profile?.qualifications || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white text-sm"
              />
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile?.qualifications || "-"}
              </p>
            )}
          </div>

          {/* Hourly Fees */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Hourly Fees
            </label>
            {isEditing ? (
              <input
                type="number"
                name="hourlyFees"
                value={profile?.hourlyFees || 0}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white text-sm"
              />
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile?.hourlyFees ? `$${profile?.hourlyFees}` : "-"}
              </p>
            )}
          </div>

          {/* Quick Slot Fees */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Quick Slot Fees
            </label>
            {isEditing ? (
              <input
                type="number"
                name="quickSlotHourlyFees"
                value={profile?.quickSlotHourlyFees || 0}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white text-sm"
              />
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile?.quickSlotHourlyFees
                  ? `$${profile?.quickSlotHourlyFees}`
                  : "-"}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Bio
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={profile?.bio || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-gray-800 dark:text-white text-sm resize-none"
                rows={4}
              />
            ) : (
              <p className="text-gray-800 dark:text-white">
                {profile?.bio || "-"}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PsychologistProfile;
