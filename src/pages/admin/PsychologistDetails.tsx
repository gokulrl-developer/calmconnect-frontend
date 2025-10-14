import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, StarIcon } from "@heroicons/react/24/outline";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { fetchPsychDetailsByAdminAPI } from "../../services/adminService";
import { useNavigate, useParams } from "react-router-dom";
import type { AdminPsychDetailsResponse } from "../../types/api/admin.types";

const PsychologistDetailsPage: React.FC = () => {
  const { psychId } = useParams();
  const navigate = useNavigate();
  const [psychologist, setPsychologist] = useState<AdminPsychDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const backToList = () => {
    navigate("/admin/psychologists");
  };

  useEffect(() => {
    const loadPsychologist = async () => {
      try {
        const result = await fetchPsychDetailsByAdminAPI(psychId!);
        if(result.data){
          console.log(result.data)
          setPsychologist(result.data.data);
        }
      } catch (err) {
        console.error("Error fetching psychologist details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPsychologist();
  }, [psychId]);

  const getStatusColor = (isBlocked: boolean) => {
    return isBlocked
      ? "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (!psychologist) return <div>No psychologist details found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={backToList}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Psychologists
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Psychologist Details
          </h1>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
            psychologist.isBlocked
          )}`}
        >
          {psychologist.isBlocked ? "Inactive" : "Active"}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                {psychologist.profilePicture ? (
                  <img
                    src={psychologist.profilePicture}
                    alt="Profile"
                    className="w-16 h-16 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center text-gray-400">
                    N/A
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {psychologist.firstName} {psychologist.lastName}
                </h2>
                {renderStars(psychologist.rating)}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                  General Info
                </h3>
                <div className="space-y-2">
                  {psychologist.dob && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">DOB:</span>{" "}
                      {new Date(psychologist.dob).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Gender:</span>{" "}
                    {psychologist.gender ?? "N/A"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Languages:</span>{" "}
                    {psychologist.languages ?? "N/A"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Joined On:</span>{" "}
                    {psychologist.createdAt
                      ? new Date(psychologist.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Info */}
          <Card className="p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-3">
              Contact Information
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Email:</span> {psychologist.email}
              </p>
              {psychologist.address && (
                <p className="text-gray-700 dark:text-gray-300 break-all">
                  <span className="font-medium">Address:</span>{" "}
                  {psychologist.address}
                </p>
              )}
            </div>
          </Card>

          {/* Bio & Qualifications */}
          <Card className="p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-3">
              Bio & Qualifications
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2 break-all">
              <span className="font-medium">Bio:</span>{" "}
              {psychologist.bio ?? "N/A"}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 break-all">
              <span className="font-medium">Qualifications:</span>{" "}
              {psychologist.qualifications ?? "N/A"}
            </p>
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                Specializations
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {psychologist.specializations?.length ? (
                  psychologist.specializations.map((spec:string, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">
                      {spec}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">N/A</p>
                )}
              </ul>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* License Document */}
          <Card className="p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-4">
              License Document
            </h3>
            {psychologist.license ? (
              <a
                href={`${psychologist.license.replace(
                  "/upload/",
                  "/upload/fl_attachment:"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" className="w-full">
                  Download License
                </Button>
              </a>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No license uploaded.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PsychologistDetailsPage;
