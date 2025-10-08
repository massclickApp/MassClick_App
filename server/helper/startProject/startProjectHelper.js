import { ObjectId } from "mongodb";
import startProjectModel from "../../model/startProject/startProjectModel.js"; 

export const createStartYourProject = async function (reqBody = {}) {
    try {
        const projectData = {
            fullName: reqBody.name,        
            email: reqBody.email,          
            contactNumber: reqBody.phone,  
            message: reqBody.message,      
            
          
        };
        
        const projectDocument = new startProjectModel(projectData);
        const result = await projectDocument.save();
        return result;
    } catch (error) {
        console.error("Error saving start project enquiry:", error);
        if (error.name === 'ValidationError') {
            throw new Error(`Validation failed: ${Object.values(error.errors).map(e => e.message).join(', ')}`);
        }
        throw error;
    }
};


export const viewStartYourProject = async (id) => {
    try {
        if (!ObjectId.isValid(id)) throw new Error("Invalid Project ID");

        const project = await startProjectModel.findById(id).lean(); 
        if (!project) throw new Error("Project enquiry not found");

        return project;
    } catch (error) {
        console.error("Error fetching project enquiry:", error);
        throw error;
    }
};


export const viewAllStartYourProject = async () => {
    try {
        const allProjects = await startProjectModel.find().sort({ submittedAt: -1 }).lean(); 
        
        return allProjects || []; 
    } catch (error) {
        console.error("Error fetching all project enquiries:", error);
        throw error;
    }
};



export const updateStartYourProject = async (id, data) => {
    try {
        if (!ObjectId.isValid(id)) throw new Error("Invalid Project ID");

        const updateData = { ...data };
        delete updateData.submittedAt; 
        delete updateData.fullName; 

        const project = await startProjectModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!project) throw new Error("Project enquiry not found");

        return project;
    } catch (error) {
        console.error("Error updating project enquiry:", error);
        throw error;
    }
};



export const deleteStartYourProject = async (id) => {
    try {
        if (!ObjectId.isValid(id)) throw new Error("Invalid Project ID");

        const deletedProject = await startProjectModel.findByIdAndDelete(id); 

        if (!deletedProject) throw new Error("Project enquiry not found");

        return deletedProject;
    } catch (error) {
        console.error("Error deleting project enquiry:", error);
        throw error;
    }
};