import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { Upload, Camera, Globe, LogOut } from "lucide-react";
import {
  fetchApplication,
  fetchRejectedApplicationAPI,
  psychologistApply,
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
  const [status, setStatus] = useState<null | string>(null);
  const [submittedFlag, setSubmittedFlag] = useState(false);
  const [rejectionReason,setRejectionReason]=useState("")

  useEffect(() => {
    async function fetchApplicationStatus() {
      try {
        const result = await fetchApplication();
        console.log(result?.data)
          await dispatch(setVerification(result.data.psych.isVerified));
          setStatus(result.data.status);
          result.data.status === "pending"
            ? setSubmittedFlag(true)
            : setSubmittedFlag(false);
      } catch (error) {}
    }
      fetchApplicationStatus();
  }, [submittedFlag]);

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
function handlePrefill(){
  setSubmittedFlag(false);
  fetchRejectedApplication();
}
  async function fetchRejectedApplication(){
    try{
      const result=await fetchRejectedApplicationAPI();
      if(result.data){
        const application:any=result.data.application.dob.toISOString()
        setFormData({...application})
      }
    }catch(error){
      console.log(error)
    }
  }
  const [formData, setFormData] = useState({
    bio: "",
    specializations: [] as string[],
    languages: "",
    profilePicture: null as File | string |null,
    phone: "",
    license: null as File | string |null,
    resume: null as File | string |null,
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
    if (!formData.profilePicture) newErrors.profilePicture = "Profile picture is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.qualifications.trim())
      newErrors.qualifications = "Qualifications are required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
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
         setSubmittedFlag(true);
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return submittedFlag === false ? (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-1/6 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut
              size={20}
              className="transition-transform group-hover:scale-110"
            />
            <p>LOGOUT</p>
          </button>
        </div>
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Complete Your Application
            </h1>
            <p className="text-gray-600">
              Provide your professional details to join our platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                {formData.profilePicture ? (
                  <img
                    src={URL.createObjectURL(formData.profilePicture as File)}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>

              {/* Upload Button */}
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

            <div className="mt-6 flex flex-col md:flex-row md:space-x-4 w-full">
              {/* DOB */}
              <div className="flex-1">
                <div className="space-y-2">
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    value={formData.dob || ""}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                      errors.dob ? 'border-red-300' : 'border-gray-300'
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
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={formData.gender || ""}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                      errors.gender ? 'border-red-300' : 'border-gray-300'
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
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Professional Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 min-h-32 ${
                  errors.bio ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Tell us about your professional background and experience..."
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio}</p>
              )}
            </div>

            {/* Qualifications */}
            <div className="space-y-2">
              <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
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
                  errors.qualifications ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.qualifications && (
                <p className="text-red-500 text-sm">{errors.qualifications}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 min-h-32 ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
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
                  onChange={(e) => handleInputChange("languages", e.target.value)}
                  placeholder="e.g., English, Spanish, French"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                    errors.languages ? 'border-red-300' : 'border-gray-300'
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
                <p className="text-red-500 text-sm">
                  {errors.specializations}
                </p>
              )}
            </div>

            {/* License */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload License Document
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => document.getElementById("license")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.license ? (formData.license as File).name : "Upload Document"}
                </Button>
                <input
                  id="license"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    handleFileUpload("license", e.target.files?.[0] || null)
                  }
                />
                {errors.license && (
                  <p className="text-red-500 text-sm">{errors.license}</p>
                )}
              </div>
            </div>

            {/* Resume */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Resume
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => document.getElementById("resume")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.resume ? (formData.resume as File).name : "Upload Document"}
                </Button>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    handleFileUpload("resume", e.target.files?.[0] || null)
                  }
                />
                {errors.resume && (
                  <p className="text-red-500 text-sm">{errors.resume}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" size="lg">
                Submit Application
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={() => handleLogout()}
            className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut
              size={20}
              className="transition-transform group-hover:scale-110"
            />
          </button>
        </div>
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {`Your Application is ${status}`}
            </h1>
            {status==="rejected"?<p>
              {rejectionReason}
            </p>:null}
          </div>
          <button onClick={handlePrefill}>
            RE-APPLY
          </button>
        </Card>
      </div>
    </div>
  );
};

export default PsychologistApplication;
