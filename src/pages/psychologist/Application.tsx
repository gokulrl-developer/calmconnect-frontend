import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { Upload, Camera, Globe, LogOut, Download } from "lucide-react";
import {
  fetchLatestApplicationAPI,
  psychologistApply,
  type LatestApplicationData,
} from "../../services/psychologistService";
import { useAppDispatch } from "../../hooks/customReduxHooks";
import {
  logout,
  setVerification,
} from "../../features/authentication/authSlice";
import { handleApiError } from "../../services/axiosInstance";
import { toast } from "sonner";
import { logOut } from "../../services/authService";

const PsychologistApplication = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [existingApplication, setExistingApplication] =
    useState<LatestApplicationData | null>(null);

  useEffect(() => {
    fetchLatestApplication();
  }, []);

  async function fetchLatestApplication() {
    try {
      const result = await fetchLatestApplicationAPI();
      await dispatch(setVerification(result.data.psych.isVerified));
      if (result.data.application) {
        console.log("fetching application", result.data.application);
        setExistingApplication(result.data.application);
      }
    } catch (error) {}
  }

  const handleLogout = async () => {
    try {
      const result = await logOut();
      if (result) {
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  /*  async function fetchRejectedApplication(){
      try{
        const result=await fetchRejectedApplicationAPI();
        if(result.data){
          const application:any=result.data.application.dob.toISOString()
          setFormData({...application})
        }
      }catch(error){
        console.log(error)
      }
    } */
  const [formData, setFormData] = useState({
    bio: "",
    specializations: [] as string[],
    languages: "",
    profilePicture: null as File | string | null,
    phone: "",
    license: null as File | string | null,
    resume: null as File | string | null,
    submittedAt: new Date(),
    address: "",
    qualifications: "",
    dob: null as string | null,
    gender: null as "male" | "female" | "others" | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const specializations = [
    "Anxiety Disorders",
    "Depression",
    "PTSD",
    "Relationship Counseling",
    "Child Psychology",
    "Addiction Therapy",
    "Cognitive Behavioral Therapy",
    "Family Therapy",
    "Grief Counseling",
    "Stress Management",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSpecializationToggle = (specialization: string) => {
    const updatedSpecializations = formData.specializations.includes(
      specialization
    )
      ? formData.specializations.filter((s: any) => s !== specialization)
      : [...formData.specializations, specialization];
    setFormData({ ...formData, specializations: updatedSpecializations });
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";
    if (formData.specializations.length === 0)
      newErrors.specializations = "At least one specialization is required";
    if (!formData.languages.trim())
      newErrors.languages = "Languages are required";
    if (!formData.license) newErrors.license = "License document is required";
    if (!formData.resume) newErrors.resume = "Resume is required";
    if (!formData.profilePicture)
      newErrors.profilePicture = "Profile picture is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.qualifications.trim())
      newErrors.qualifications = "Qualifications are required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (formData.dob) {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old";
      }
    }
    if (!formData.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (validateForm()) {
        const formDataInstance = new FormData();
        formDataInstance.append("bio", formData.bio);
        formDataInstance.append("languages", formData.languages);
        formDataInstance.append("phone", formData.phone);
        formDataInstance.append("address", formData.address);
        formDataInstance.append(
          "submittedAt",
          formData.submittedAt.toISOString()
        );
        formDataInstance.append("qualifications", formData.qualifications);
        if (formData.dob) formDataInstance.append("dob", formData.dob);
        if (formData.gender) formDataInstance.append("gender", formData.gender);

        formData.specializations.forEach((spec, i) => {
          formDataInstance.append(`specializations[${i}]`, spec);
        });

        if (formData.profilePicture) {
          formDataInstance.append("profilePicture", formData.profilePicture);
        }
        if (formData.license) {
          formDataInstance.append("license", formData.license);
        }
        if (formData.resume) {
          formDataInstance.append("resume", formData.resume);
        }

        const res = await psychologistApply(formDataInstance);
        if (res.data) {
          toast("Application submitted successfully");
          fetchLatestApplication();
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  function handleShowForm(prefill: boolean) {
    console.log("exisign application", existingApplication);
    if (
      prefill &&
      existingApplication &&
      existingApplication.status === "rejected"
    ) {
      setFormData({
        bio: existingApplication.bio || "",
        specializations: existingApplication.specializations || [],
        languages: existingApplication.languages || "",
        profilePicture: existingApplication.profilePicture || null,
        phone: existingApplication.phone || "",
        license: existingApplication.licenseUrl || null,
        resume: existingApplication.resume || null,
        submittedAt: new Date(),
        address: existingApplication.address || "",
        qualifications: existingApplication.qualifications || "",
        dob: existingApplication.dob
          ? new Date(existingApplication.dob).toISOString().split("T")[0]
          : null,
        gender: existingApplication.gender || null,
      });
    }
    setShowForm(true);
  }

  // ---------------------- FORM UI ----------------------
  return showForm === true ? (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {existingApplication?.status === "rejected"
              ? "Update and Reapply"
              : "Complete Your Application"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-dashed border-gray-300">
                {formData.profilePicture ? (
                  typeof formData.profilePicture === "string" ? (
                    <img
                      src={formData.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(formData.profilePicture)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <Camera className="w-10 h-10 text-gray-400 m-auto mt-8" />
                )}
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={() =>
                  document.getElementById("profile-picture")?.click()
                }
              >
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleFileUpload(
                    "profilePicture",
                    e.target.files?.[0] || null
                  )
                }
              />
              {errors.profilePicture && (
                <p className="text-red-500 text-sm">{errors.profilePicture}</p>
              )}
            </div>
            {/* DOB */}
            <div className="flex-1">
              <div className="space-y-2">
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={formData.dob || ""}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                    errors.dob ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm">{errors.dob}</p>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="flex-1">
              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  value={formData.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                    errors.gender ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex-1">
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Professional Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 min-h-32 ${
                  errors.bio ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Tell us about your professional background and experience..."
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio}</p>
              )}
            </div>

            {/* Qualifications */}
            <div className="space-y-2">
              <label
                htmlFor="qualifications"
                className="block text-sm font-medium text-gray-700"
              >
                Qualifications
              </label>
              <input
                id="qualifications"
                type="text"
                value={formData.qualifications}
                onChange={(e) =>
                  handleInputChange("qualifications", e.target.value)
                }
                placeholder="Enter your qualifications"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                  errors.qualifications ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.qualifications && (
                <p className="text-red-500 text-sm">{errors.qualifications}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 min-h-32 ${
                  errors.address ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <label
                htmlFor="languages"
                className="block text-sm font-medium text-gray-700"
              >
                Languages Spoken
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe size={16} className="text-gray-400" />
                </div>
                <input
                  id="languages"
                  type="text"
                  value={formData.languages}
                  onChange={(e) =>
                    handleInputChange("languages", e.target.value)
                  }
                  placeholder="e.g., English, Spanish, French"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                    errors.languages ? "border-red-300" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.languages && (
                <p className="text-red-500 text-sm">{errors.languages}</p>
              )}
            </div>

            {/* Specializations */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Specializations
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specializations.map((specialization) => (
                  <label
                    key={specialization}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(
                        specialization
                      )}
                      onChange={() =>
                        handleSpecializationToggle(specialization)
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      {specialization}
                    </span>
                  </label>
                ))}
              </div>
              {errors.specializations && (
                <p className="text-red-500 text-sm">{errors.specializations}</p>
              )}
            </div>

            {/* License + Resume */}
            {(["license", "resume"] as const).map((field) => {
              const value = formData[field];
              const label =
                field === "license"
                  ? "Upload License Document"
                  : "Upload Resume";

              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {label}
                  </label>

                  {typeof value === "string" ? (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(value, "_blank")}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => document.getElementById(field)?.click()}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Re-upload
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => document.getElementById(field)?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  )}

                  <input
                    id={field}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(field, e.target.files?.[0] || null)
                    }
                  />

                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              );
            })}

            <Button type="submit" className="w-full py-3 text-lg font-semibold">
              Submit Application
            </Button>
          </form>
        </Card>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Card className="p-10 max-w-2xl text-center shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {existingApplication === null
            ? "Become a Verified Psychologist"
            : existingApplication && existingApplication.status === "pending"
            ? "Your Application is Pending"
            : existingApplication && existingApplication.status === "rejected"
            ? "Your Application was Rejected"
            : ""}
        </h1>

        {existingApplication === null && (
          <>
            <p className="text-gray-600 mb-2">
              You need to fill the form and apply to become a verified
              psychologist.
            </p>
            <p className="text-gray-500 italic mb-8">
              You can only apply 3 times from one account.
            </p>
            <Button
              onClick={() => handleShowForm(false)}
              size="lg"
              className="px-6 py-3 text-lg font-semibold"
            >
              Fill Form
            </Button>
          </>
        )}

        {existingApplication && existingApplication.status === "pending" && (
          <>
            <p className="text-gray-600 mb-3">
              Your application is under review.
            </p>
            <p className="text-gray-500">
              Submitted on{" "}
              <span className="font-semibold">
                {new Date(
                  existingApplication!.submittedAt
                ).toLocaleDateString()}
              </span>
            </p>
          </>
        )}

        {existingApplication && existingApplication.status === "rejected" && (
          <>
            <p className="text-gray-600 mb-4">
              Your application was rejected for the following reason:
            </p>
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-6">
              {existingApplication?.rejectionReason || "No reason provided"}
            </div>
            <Button
              onClick={() => handleShowForm(true)}
              variant="secondary"
              size="lg"
            >
              Re-Apply
            </Button>
          </>
        )}

        <button
          onClick={handleLogout}
          className="mt-8 text-red-600 hover:underline flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </Card>
    </div>
  );
};

export default PsychologistApplication;
