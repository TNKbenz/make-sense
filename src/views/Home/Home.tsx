import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showMainPopup, setShowMainPopup] = useState(true);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showListProjectPopup, setShowListProjectPopup] = useState(false);
  const [ListProject, setListProject] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedOption, setSelectedOption] = useState('classification');

  useEffect(() => {

    const mockData = [
      { _id: 1, text: 'Project A', type: 'Classify' },
      { _id: 2, text: 'Project B', type: 'Object Detection' },
      { _id: 3, text: 'Project C', type: 'Object Detection' },
    ];

    setListProject(mockData);
  }, []);
  //   fetchListProject();
  // }, []);

  const fetchListProject = async () => {
    try {
      const response = await axios.get('http://localhost:3001/ListProject');
      setListProject(response.data.ListProject);
    } catch (error) {
      console.error('Error fetching ListProject:', error);
    }
  };

  const handleAddProject = async () => {
    try {
      await axios.post('http://localhost:3001/ListProject', { text: newProject , selectedOption});
      fetchListProject();
      navigate('/home');
      setNewProject('');
    } catch (error) {
      console.error('Error adding ListProject:', error);
    }
  };

  const handleDeleteListProject = async (projectId) => {
    try {
      await axios.delete(`http://localhost:3001/Project/${projectId}`);
      fetchListProject();
    } catch (error) {
      console.error('Error deleting ListProject:', error);
    }
  };

  const handleCreateProjectClick = () => { 
    setShowMainPopup(false);
    setShowCreatePopup(true);
    setShowListProjectPopup(false);
  };

  const handleOpenProjectClick = () => {
    setShowMainPopup(false);
    setShowCreatePopup(false);
    setShowListProjectPopup(true);
  };

  const handleBackClick = () => {
    setShowMainPopup(true);
    setShowCreatePopup(false);
    setShowListProjectPopup(false);
  };

  const handleSelectListProject = (projectId) => {
    try {
      const selected = ListProject.find((project) => project._id === projectId);
      setSelectedProject(selected);
      console.log('Selected Project:', projectId);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleOpenClick = () => {
    if (selectedProject) {
      console.log('Selected Project:', selectedProject.text);
      navigate('/home');
    }
    
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome to Home Page</h2>

      {showMainPopup && (
        <div>
          <button className='button-1' onClick={handleCreateProjectClick}>Create Project</button>
          <br />
          <button className='button-1' onClick={handleOpenProjectClick}>Open Project</button>
        </div>
      )}

      {showCreatePopup && (
        <div>
          <h2>Create Project</h2>
          <div >
            <div>Project name:</div>
            <input style={{ width: '10%', padding: '8px', margin: '10px auto', border: '1px solid #000000', borderRadius: '5px', textAlign: 'center' }} 
              type="text" value={newProject} onChange={(e) => setNewProject(e.target.value)} />
            <div>Project Type:</div>
            <select className='button-23' id="options" value={selectedOption} onChange={handleOptionChange}>
              <option value="classification">Classification</option>
              <option value="ObjectDetection">Object Detection</option>
            </select>
            <div>
              <button className='button-1' onClick={handleAddProject}>Add Project</button>
              <button className='button-1' onClick={handleBackClick}>Back</button>
            </div>
          </div>
        </div>
      )}

      {showListProjectPopup && (
        <div>
          <h2>Select Project</h2>
          <table style={{ width: '60%', margin: 'auto', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ width: '40%', border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Text</th>
                <th style={{ width: '20%', border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Type</th>
                <th style={{ width: '20%', border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ListProject.map((Project, index) => (
                <tr key={Project._id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{Project.text}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{Project.type}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button className="button-16" role="button" onClick={() => handleSelectListProject(Project._id)}>Select</button>
                    <button className="button-16" role="button" onClick={() => handleDeleteListProject(Project._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button className='button-1' onClick={handleOpenClick}>Open {selectedProject.text} Project</button>
            <button className='button-1' onClick={handleBackClick}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

