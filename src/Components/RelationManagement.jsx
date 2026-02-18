import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Edit, Trash2 } from "lucide-react";

const RelationManagement = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [relations, setRelations] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  const fetchPatients = async (authToken) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/caregiver/my-patients",
        {},
        { headers: { 'token': authToken } }
      );

      if (response.data.status === "SUCCESS") {
        if (response.data.data.length > 0 && !selectedPatientId) {
          setSelectedPatientId(response.data.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchRelations = async (authToken, patientId) => {
    if (!patientId) return;

    try {
      setLoading(true);
      setServerError("");

      const response = await axios.post(
        "http://localhost:5000/api/caregiver/allRelations",
        { patientId },
        { headers: { 'token': authToken } }
      );

      if (response.data.status === "SUCCESS") {
        setRelations(response.data.data || []);
      } else {
        setServerError(response.data.message || "Failed to fetch relations");
      }
    } catch (error) {
      console.error(error);
      setServerError("Something went wrong while fetching relations!");
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

  useEffect(() => {
    if (token && selectedPatientId) {
      fetchRelations(token, selectedPatientId);
    }
  }, [token, selectedPatientId]);


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border rounded-lg shadow-sm p-5">

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-800">Relation Management</h2>
            <button
              onClick={() => selectedPatientId ? navigate(`/addRelation`) : alert("Please select a patient first")}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <UserPlus className="w-4 h-4" />
              Add Relation
            </button>
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

          {!loading && selectedPatientId && relations.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No relations found for this patient</p>
            </div>
          )}

          {!loading && relations.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Person</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Relation</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {relations.map((relation) => (
                    <tr key={relation._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {relation.photo ? (
                            <img
                              src={`http://localhost:5000${relation.photo}`}
                              alt={relation.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-green-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{relation.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{relation.relation}</td>
                      <td className="px-4 py-3 text-sm">
                        {relation.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                          relation.alive === "Alive" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-200 text-gray-700"
                        }`}>
                          {relation.alive}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => navigate(`/editRelation/${relation._id}`)}
                            className="p-2 text-green-600 hover:bg-blue-50 rounded"
                            title="Edit"
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

          {!selectedPatientId && !loading && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Please select a patient to view relations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationManagement;