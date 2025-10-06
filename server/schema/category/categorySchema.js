import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    categoryImage: { type: String, default: '', },
    category: { type: String, default: '',  required: true },
    categoryType: { type: String, default: '', },
    subCategoryType: { type: String, default: '' },
    title: { type: String, default: '', required: true },
    keywords: { type: String, default: '',  required: true },
    description: { type: String, default: '',  required: true },
    isActive: { type: Boolean, default: true },
});

export default categorySchema;