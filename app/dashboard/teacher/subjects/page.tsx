"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "../../../../src/hooks/useDashboardStore";
import TeacherNavbar from "../../../../src/components/TeacherNavbar";
import { BookOpen, ChevronLeft, Plus, Edit2, Save, X } from "lucide-react";
import Cookies from "js-cookie";

export default function SubjectsPage() {
  const router = useRouter();
  const { 
    teacher_subjects, 
    loading, 
    get_dashboard_data, 
    get_teacher_subs,
    update_teacher_subs 
  } = useDashboardStore();
  
  const [editMode, setEditMode] = useState(false);
  const [editedSubjects, setEditedSubjects] = useState<{subject_name: string, subject_code: string}[]>([]);
  const [newSubject, setNewSubject] = useState({ subject_name: '', subject_code: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const authToken = Cookies.get("jwt_Token");
    if (!authToken) {
      router.push("/auth?model=teacher");
      return;
    }

    // Load dashboard data if not already loaded
    get_dashboard_data(authToken);
    get_teacher_subs(authToken);
  }, []);

  useEffect(() => {
    if (teacher_subjects) {
      setEditedSubjects([...teacher_subjects]);
    }
  }, [teacher_subjects]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setIsAdding(false);
    setNewSubject({ subject_name: '', subject_code: '' });
    if (teacher_subjects) {
      setEditedSubjects([...teacher_subjects]);
    }
  };

  const handleSave = async () => {
    const authToken = Cookies.get("jwt_Token"); // Fixed: use jwt_Token for consistency
    if (!authToken) return;

    setSaving(true);
    try {
      let finalSubjects = [...editedSubjects];
      
      // Add new subject if being added
      if (isAdding && newSubject.subject_name && newSubject.subject_code) {
        finalSubjects.push(newSubject);
      }
      
      await update_teacher_subs(authToken, finalSubjects);
      setEditMode(false);
      setIsAdding(false);
      setNewSubject({ subject_name: '', subject_code: '' });
    } catch (error) {
      console.error('Failed to save subjects:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubjectChange = (index: number, field: 'subject_name' | 'subject_code', value: string) => {
    const updated = [...editedSubjects];
    updated[index] = { ...updated[index], [field]: value };
    setEditedSubjects(updated);
  };

  const handleRemoveSubject = (index: number) => {
    const updated = editedSubjects.filter((_, i) => i !== index);
    setEditedSubjects(updated);
  };

  const handleAddSubject = () => {
    setIsAdding(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNavbar />
      
      <div className="pt-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/dashboard/teacher")}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Subjects</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Manage the subjects you teach
                </p>
              </div>
              
              {!editMode && (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Subjects
                </button>
              )}
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {editMode ? (
              // Edit Mode
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Edit Subjects</h2>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      disabled={saving}
                    >
                      <X className="w-4 h-4 mr-2 inline" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-2 inline" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {editedSubjects.map((subject, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={subject.subject_name}
                          onChange={(e) => handleSubjectChange(index, 'subject_name', e.target.value)}
                          placeholder="Subject Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={subject.subject_code}
                          onChange={(e) => handleSubjectChange(index, 'subject_code', e.target.value)}
                          placeholder="Subject Code"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveSubject(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {isAdding && (
                    <div className="flex items-center space-x-4 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newSubject.subject_name}
                          onChange={(e) => setNewSubject({ ...newSubject, subject_name: e.target.value })}
                          placeholder="Subject Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newSubject.subject_code}
                          onChange={(e) => setNewSubject({ ...newSubject, subject_code: e.target.value })}
                          placeholder="Subject Code"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => setIsAdding(false)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {!isAdding && (
                    <button
                      onClick={handleAddSubject}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <Plus className="w-5 h-5 mx-auto mb-2" />
                      Add New Subject
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // View Mode
              <>
                {teacher_subjects && teacher_subjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teacher_subjects.map((subject, index) => (
                      <div key={index} className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <BookOpen className="w-6 h-6 text-blue-600 mr-4" />
                        <div>
                          <h3 className="font-medium text-gray-900">{subject.subject_name}</h3>
                          <p className="text-sm text-gray-500">{subject.subject_code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No subjects added</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add subjects to let parents know what you can teach.
                    </p>
                    <button
                      onClick={handleEdit}
                      className="mt-4 flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Subject
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Subject Guidelines */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Subject Guidelines</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Be specific about the subjects you're qualified to teach</li>
              <li>• Use standard subject codes when possible (e.g., MATH-10, PHYSICS-12)</li>
              <li>• Include grade levels or specializations in your subject names</li>
              <li>• Keep subject names clear and easy to understand</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}