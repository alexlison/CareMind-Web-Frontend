import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Eye, Edit } from "lucide-react";

const PatientManagement = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  const fetchPatients = async (authToken) => {
    try {
      setLoading(true);
      setServerError("");

      const response = await axios.post(
        "http://localhost:5000/api/caregiver/my-patients",
        {},
        { headers: { 'token': authToken } }
      );

      console.log(response.data.data)
      if (response.data.status === "SUCCESS") {
        setPatients(response.data.data || []);
      } else {
        setServerError(response.data.message || "Failed to fetch patients");
      }
    } catch (error) {
      console.error(error);
      setServerError("Something went wrong while fetching patients!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUserType = sessionStorage.getItem("userType");

    if (!storedToken || storedUserType !== "caregiver") {
      alert("Access denied! Only caregivers can access this page.");
      navigate("/");
      return;
    }

    setToken(storedToken);
    fetchPatients(storedToken);
  }, [navigate]);

  const handleToggleStatus = async (patientId, isActive) => {
    const action = isActive ? "deactivate" : "activate";

    if (!window.confirm(`Are you sure you want to ${action} this patient?`))
      return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/caregiver/toggle-status/${patientId}`,
        {},
        { headers: { token } }
      );

      if (response.data.status === "SUCCESS") {
        fetchPatients(token);
      } else {
        alert(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  const canAddPatient =
    patients.length === 0 || patients.every((p) => !p.isActive);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border rounded-lg shadow-sm p-5">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-800">
                Patient Management
              </h2>
           
            </div>

            {canAddPatient && (
              <button
                onClick={() => navigate("/addPatient")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <UserPlus className="w-4 h-4" />
                Add Patient
              </button>
            )}
          </div>

          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-600" />
            </div>
          )}

          {!loading && patients.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No patients found</p>
            </div>
          )}

          {!loading && patients.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Nickname
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Gender
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {patients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50">

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {patient.imageUrl ? (
                            <img
                              src={`http://localhost:5000${patient.imageUrl}`}
                              alt={patient.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-green-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {patient.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {patient.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {patient.nickName  || "—"}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {patient.emergencyContact?.phone  || "—"}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {patient.personalDetails?.gender || "N/A"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            patient.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {patient.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() =>
                              handleToggleStatus(patient._id, patient.isActive)
                            }
                            className={`relative inline-flex h-5 w-9 rounded-full ${
                              patient.isActive ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`absolute left-1 top-1 h-3 w-3 rounded-full bg-white transition-transform ${
                                patient.isActive ? "translate-x-4" : ""
                              }`}
                            />
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/caregiver/EditPatient/${patient._id}`)
                            }
                            className="p-2 text-green-600 hover:bg-blue-50 rounded"
                            title="Edit Patient"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
