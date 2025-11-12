import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Upload, Trash2 } from "lucide-react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import type { TimeCapsule } from "../types/common/TimeCapsule";
import { uploadTimeCapsuleImage } from "../storage";
import { addTimeCapsule } from "../apis/timeCapsuleApis";

interface CreateTimeCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (capsule: TimeCapsule) => void;
}

const CreateTimeCapsuleModal: React.FC<CreateTimeCapsuleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  //get currentUser from local storage
  const currentUser = localStorage.getItem("currentUser") as
    | "Maria"
    | "Leo"
    | null;

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    unlockDate: null as Dayjs | null,
    emailNotification: false,
    picture: null as File | null,
    notificationEmail: "",
  });
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      picture: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!formData.title.trim()) {
      setFormError("Please enter a title");
      return;
    }
    if (!formData.message.trim()) {
      setFormError("Please enter your message");
      return;
    }
    if (!formData.unlockDate) {
      setFormError("Please select an unlock date");
      return;
    }

    // Check if unlock date is in the future
    const unlockDateObj = formData.unlockDate.toDate();
    if (unlockDateObj <= new Date()) {
      setFormError("Unlock date must be in the future");
      return;
    }

    // Create new capsule
    try {
      setIsLoading(true);

      // Upload image only if provided (optional)
      let downloadImgUrl: string | undefined = undefined;
      if (formData.picture) {
        downloadImgUrl = await uploadTimeCapsuleImage(
          formData.picture,
          currentUser
        );
      }

      let newCapsule: TimeCapsule;
      if (currentUser) {
        newCapsule = {
          id: Date.now().toString(),
          title: formData.title,
          message: formData.message,
          unlockDate: formData.unlockDate.toISOString(),
          createdDate: new Date().toISOString(),
          createdBy: currentUser,
          emailAddress: formData.notificationEmail,
          picture: downloadImgUrl,
        };
      } else {
        setIsLoading(false);
        setFormError("User not found, try to log in again!");
        return;
      }

      await addTimeCapsule(newCapsule);

      console.log("newCapsule:,", newCapsule);

      onSubmit(newCapsule);

      // Reset form
      setFormData({
        title: "",
        message: "",
        unlockDate: null,
        emailNotification: false,
        picture: null,
        notificationEmail: "",
      });
      onClose();
      setFormError("");
      setIsLoading(false);
    } catch (error) {
      setFormError("Failed to create time capsule. Please try again.");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      title: "",
      message: "",
      unlockDate: null,
      emailNotification: false,
      picture: null,
      notificationEmail: "",
    });
    setFormError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black  z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={handleClose}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex  items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl  w-[30vw] h-[76vh] flex flex-col justify-start overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-3xl">
                <div>
                  <h2 className="text-2xl font-elegant font-semibold text-gray-900">
                    Create a Time Capsule
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Write a letter to your partner in the future. Once
                    scheduled, it cannot be canceled!
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <form className="p-6 space-y-4">
                {/* Error Message */}
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-3"
                  >
                    <p className="text-red-700 font-medium text-sm">
                      {formError}
                    </p>
                  </motion.div>
                )}

                {/* Title Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Our 2nd Anniversary"
                    className="w-full px-4 py-3 rounded-2xl border border-pink-light focus:border-pink-bright focus:outline-none focus:ring-1 focus:ring-pink-bright transition-colors"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write your letter here..."
                    rows={9}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-pink-bright focus:outline-none focus:ring-1 focus:ring-pink-bright transition-colors resize-none"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Attach Photo (Optional)
                  </label>

                  {/* Image Preview */}
                  {formData.picture && (
                    <div
                      style={{
                        height: "7rem",
                      }}
                      className="mb-3  border border-gray-200 relative rounded-lg overflow-hidden"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <img
                          src={URL.createObjectURL(formData.picture)}
                          alt="preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div
                          onClick={() => removeImage()}
                          className="absolute inset-0 cursor-pointer bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-all duration-300 rounded-lg"
                        >
                          <Trash2 size={24} className="text-white" />
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Upload Input */}
                  {!formData.picture && (
                    <label
                      style={{
                        height: "7rem",
                      }}
                      className="flex  flex-col items-center justify-center border-2 border-dashed border-pink-300  rounded-2xl p-4 cursor-pointer hover:border-pink-500  hover:bg-pink-200 transition-all  duration-200 bg-pink-50"
                    >
                      <Upload size={24} className="text-pink-500 mb-2" />
                      <span className="text-md font-medium text-pink-600 text-center">
                        Click to add a photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            setFormData((prev) => ({
                              ...prev,
                              picture: files[0],
                            }));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Unlock Date Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unlock Date
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={formData.unlockDate}
                      onChange={(newValue) => {
                        setFormData((prev) => ({
                          ...prev,
                          unlockDate: newValue,
                        }));
                      }}
                      minDate={dayjs().add(1, "day")}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          className: "w-full",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "1rem",
                              fontSize: "0.95rem",
                              "& fieldset": {
                                borderColor: "#d1d5db",
                              },
                              "&:hover fieldset": {
                                borderColor: "#9ca3af",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ec4899",
                              },
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "12px 16px",
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>

                {/* Warning Message */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-2 items-center flex gap-2">
                  <span className="text-yellow-600 text-sm">⚠️</span>
                  <p className="text-yellow-700 text-sm">
                    this capsule cannot be edited or deleted until the unlock
                    date
                  </p>
                </div>

                {/* Email Notification Checkbox - COMMENTED OUT FOR NOW */}
                {/* <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="emailNotification"
                      name="emailNotification"
                      checked={formData.emailNotification}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                    <label
                      htmlFor="emailNotification"
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Send email notification on unlock day
                    </label>
                  </div>

                  {/* Email Input - shown when checkbox is checked */}
                {/* {formData.emailNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="ml-7"
                    >
                      <input
                        type="email"
                        name="notificationEmail"
                        value={formData.notificationEmail}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-pink-bright focus:outline-none focus:ring-1 focus:ring-pink-bright transition-colors text-sm"
                      />
                    </motion.div>
                  )} */}
                {/* </div> */}
              </form>
              {/* Action Buttons */}
              <div className="flex mt-auto flex-1  flex-col justify-end  pb-8">
                <div className=" flex flex-row  px-12 justify-between gap-10">
                  <button
                    style={{ height: 60 }}
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 cursor-pointer text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-2xl bg-pink-400 cursor-pointer hover:bg-pink-500 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="flex items-center justify-center"
                        >
                          <Lock size={18} />
                        </motion.div>
                        <span>Sealing...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        <span>Seal & Schedule</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTimeCapsuleModal;
