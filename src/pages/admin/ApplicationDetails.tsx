import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { fetchApplicationDetails, updateApplication } from '../../services/adminService';
import { useNavigate, useParams } from 'react-router-dom';
import type { ApplicationDetails } from '../../services/adminService';
import Modal from '../../components/UI/Modal';



const ApplicationDetailsPage: React.FC= () => {
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const {applicationId}=useParams();
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [rejectionReasonError, setRejectionReasonError] = useState<string>('');
  const navigate=useNavigate();
 const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | null;
  }>({
    isOpen: false,
    type: null,
  });
  const openConfirmationModal = (type: 'approve' | 'reject') => {
    setConfirmationModal({
      isOpen: true,
      type,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      type: null,
    });
  };

  const handleConfirmAction = async() => {
    try{
    if (confirmationModal.type) {
      if(confirmationModal.type==='approve'){
         await handleApprove()
      }else if(confirmationModal.type==='reject'){
        await handleReject()
      }
      closeConfirmationModal();
    }
    }catch(error){

    }
    
  };
  useEffect(() => {
    const loadApplication = async () => {
      try {
        const data = await fetchApplicationDetails(applicationId!);
        setApplication(data.details);
      } catch (err:any) {
        console.log("error fetching app details",err?.response?.data);
        if(err.response?.data?.code==="NOT_FOUND"){
          backToList()
        }
      }
    };
    loadApplication();
  }, [applicationId]);

  const handleApprove = async () => {
    if (!application) return;
    try {
      await updateApplication(applicationId!, 'accepted',null);
      setApplication({ ...application, status: 'accepted' });
    } catch (err) {
      console.error('Error approving application:', err);
    }
  };

  const handleReject = async () => {
     if(!rejectionReason || typeof rejectionReason !== "string" ||rejectionReason.trim()===""){
      setRejectionReasonError("Rejection reason is required");
      return;
      }
    try {
      const reason=rejectionReason?rejectionReason:null;
      await updateApplication(applicationId!, 'rejected',reason);
      setApplication({ ...application!, status: 'rejected' });
    } catch (err) {
      console.error('Error rejecting application:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const backToList=()=>{
    navigate("/admin/applications")
  }

  if (!application) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="secondary"
           onClick={()=>backToList()}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Applications
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Application Details</h1>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <img src={application.profilePicture} alt="Profile" className="w-16 h-16 object-cover rounded-full" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{application.firstName} {application.lastName}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white mb-3">General Info</h3>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">DOB:</span> {new Date(application.dob).toLocaleDateString()}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Languages:</span> {application.languages}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Applied on:</span> {new Date(application.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-3">Contact Information</h3>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Email:</span> {application.email}</p>
              {application.phone && <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Phone:</span> {application.phone}</p>}
              <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Gender:</span> {application.gender}</p>
              <p className="text-gray-700 dark:text-gray-300 break-all"><span className="font-medium">Address:</span> {application.address}</p>
            </div>
          </Card>

          {/* Bio & Qualifications  */}
          <Card className="p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-3">Bio & Qualifications</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2 break-all"><span className="font-medium">Bio:</span> {application.bio}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 break-all"><span className="font-medium">Qualifications:</span> {application.qualifications}</p>
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-2 break-all">Specializations</h4>
              <ul className="list-disc list-inside space-y-1">
                {application.specializations.map((spec, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">{spec}</li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Documents */}
          <Card className="p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-4">Documents</h3>
            <div className="space-y-3">
              <a href={`${application.licenseUrl.replace('/upload/', '/upload/fl_attachment:')}`} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" className="w-full my-1">Download License</Button>
              </a>
              <a href={`${application.resume.replace('/upload/', '/upload/fl_attachment:')}`} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" className="w-full my-1">Download Resume</Button>
              </a>
            </div>
          </Card>

          {/* Actions */}
          {application.status === 'pending' && (
            <Card className="p-6">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <Button variant="success" className="w-full flex items-center justify-center" onClick={()=>openConfirmationModal('approve')}>
                  <CheckIcon className="w-4 h-4 mr-2" /> Approve Application
                </Button>
                <Button variant="danger" className="w-full flex items-center justify-center" onClick={()=>openConfirmationModal('reject')}>
                  <XMarkIcon className="w-4 h-4 mr-2" /> Reject Application
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        title={`${confirmationModal.type === 'approve' ? 'Approve' : 'Reject'} Application`}
      >
          <div className="space-y-4 p-3">
            <div className="flex items-center space-x-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                    Are you sure you want to {confirmationModal.type} this application? <br/>
                    This action cannot be undone.
               </h4>
              
              </div>
             
            </div>
            <div className="rounded-lg p-4">
              <p className="text-md">
                {confirmationModal.type === 'approve'
                  ? 'This psychologist will be granted access to the platform and can start accepting sessions.'
                  : 'This application will be rejected and the applicant will be notified via email.'
                }
              </p>
               {/* Rejection Reason */}
            {confirmationModal.type==="reject"?(<div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 min-h-32 ${
                  rejectionReasonError ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter Rejection Reason"
              />
              {rejectionReasonError && (
                <p className="text-red-500 text-sm">{rejectionReasonError}</p>
              )}
            </div>):null}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={closeConfirmationModal}
              >
                Cancel
              </Button>
              <Button
                variant={confirmationModal.type === 'approve' ? 'success' : 'danger'}
                onClick={handleConfirmAction}
              >
                {confirmationModal.type === 'approve' ? 'Approve Application' : 'Reject Application'}
              </Button>
            </div>
          </div>
      </Modal>
    </div>
  );
};

export default ApplicationDetailsPage;