import { ObjectId } from "mongodb";
import businessListModel from "../../model/businessList/businessListModel.js"
import SearchLogModel from "../../model/businessList/searchLogModel.js"
import mongoose from "mongoose";
import { uploadImageToS3, getSignedUrlByKey } from "../../s3Uploder.js";


export const createBusinessList = async function (reqBody = {}) {
    try {
        if (reqBody.bannerImage) {
            const uploadResult = await uploadImageToS3(
                reqBody.bannerImage,
                // FIX: Add 'banners/' prefix
                `businessList/banners/banner-${Date.now()}` 
            );
            delete reqBody.bannerImage;
            reqBody.bannerImageKey = uploadResult.key; 
        }

        if (reqBody.businessImages && reqBody.businessImages.length > 0) {
            const businessImageKeys = await Promise.all(
                reqBody.businessImages.map(async (img, i) => {
                    const uploadResult = await uploadImageToS3(
                        img,
                        // FIX: Add 'gallery/' prefix
                        `businessList/gallery/image-${Date.now()}-${i}` 
                    );
                    return uploadResult.key;
                })
            );
            delete reqBody.businessImages;
            reqBody.businessImagesKey = businessImageKeys;
        }

        const businessListDocument = new businessListModel(reqBody);
        const result = await businessListDocument.save();
        return result;
    } catch (error) {
        console.error("Error saving Business:", error);
        throw error;
    }
};

export const viewBusinessList = async (id) => {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid business ID");
        }

        const business = await businessListModel.findById(id).lean();
        if (!business) {
            throw new Error("business not found");
        }

        if (business.bannerImageKey) {
            business.bannerImage = getSignedUrlByKey(business.bannerImageKey);
        }

        if (business.businessImagesKey?.length > 0) {
            business.businessImages = business.businessImagesKey.map(key => 
                getSignedUrlByKey(key)
            );
        }

        return business;
    } catch (error) {
        console.error("Error in business:", error);
        throw error;
    }
};

export const viewAllBusinessList = async () => {
    try {
        const businessList = await businessListModel.find().lean();
        if (!businessList || businessList.length === 0) {
            throw new Error("No business found");
        }

        // 🌟 Map through results to generate Signed URLs
        const businessesWithSignedUrls = businessList.map(business => {
            // Banner Image
            if (business.bannerImageKey) {
                business.bannerImage = getSignedUrlByKey(business.bannerImageKey);
            }
            // Business Images Array
            if (business.businessImagesKey?.length > 0) {
                 business.businessImages = business.businessImagesKey.map(key => 
                    getSignedUrlByKey(key)
                );
            }
            return business;
        });

        return businessesWithSignedUrls;
    } catch (error) {
        console.error("Error fetching business:", error);
        throw error; 
    }
};

export const updateBusinessList = async (id, data) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid business ID");

    if (data.bannerImage && typeof data.bannerImage === 'string' && data.bannerImage.startsWith('data:image')) {
        const uploadResult = await uploadImageToS3(
            data.bannerImage,
            // FIX: Add 'banners/' prefix
            `businessList/businessbanners/banner-${Date.now()}` 
        );
        data.bannerImageKey = uploadResult.key;
    } else if (data.bannerImage === null || data.bannerImage === '') {
        data.bannerImageKey = '';
    }
    delete data.bannerImage; 

    if (data.businessImages && Array.isArray(data.businessImages)) {
        const newKeys = await Promise.all(
            data.businessImages.map(async (img, i) => {
                if (typeof img === 'string' && img.startsWith('data:image')) {
                    const uploadResult = await uploadImageToS3(
                        img,
                        // FIX: Add 'gallery/' prefix
                        `businessList/businessgallery/image-${Date.now()}-${i}` 
                    );
                    return uploadResult.key; 
                }
                return img; 
            })
        );
        data.businessImagesKey = newKeys.filter(k => k); 
    } else if (data.businessImages === null || (Array.isArray(data.businessImages) && data.businessImages.length === 0)) {
         data.businessImagesKey = []; 
    }
    delete data.businessImages; 
    
    const business = await businessListModel.findByIdAndUpdate(id, data, { new: true });
    if (!business) throw new Error("Business not found");

    if (business.bannerImageKey) {
        business.bannerImage = getSignedUrlByKey(business.bannerImageKey);
    }
    if (business.businessImagesKey?.length > 0) {
        business.businessImages = business.businessImagesKey.map(key => 
            getSignedUrlByKey(key)
        );
    }

    return business;
};

export const deleteBusinessList = async (id) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid business ID");
   
    const deletedbusiness = await businessListModel.findByIdAndDelete(id);
    if (!deletedbusiness) throw new Error("business not found");
    return deletedbusiness;
};

export const activeBusinessList = async (id, newStatus) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid business ID");

    const business = await businessListModel.findByIdAndUpdate(
        id,
        { activeBusinesses: newStatus },
        { new: true }
    );

    if (!business) throw new Error("Business not found");

    return business;
};

export const getTrendingSearches = async (limit = 4, location) => {
    try {
        const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

        const pipeline = [
            {
                $match: {
                    createdAt: { $gte: twoDaysAgo },
                }
            },
            {
                $group: {
                    _id: "$categoryName", 
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: limit
            },
            {
                $project: {
                    _id: 0, 
                    name: "$_id", 
                    path: { $concat: ["/trending/", { $toLower: "$_id" }] }, 
                }
            }
        ];

        const trendingResults = await SearchLogModel.aggregate(pipeline);
        return trendingResults;

    } catch (error) {
        console.error("Error fetching trending searches:", error);
        return [];
    }
};