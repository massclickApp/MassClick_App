import { ObjectId } from "mongodb";
import businessListModel from "../../model/businessList/businessListModel.js";
import SearchLogModel from "../../model/businessList/searchLogModel.js";
import mongoose from "mongoose";
import { uploadImageToS3, getSignedUrlByKey } from "../../s3Uploder.js";


export const createBusinessList = async (reqBody = {}) => {
    try {
        if (reqBody.bannerImage) {
            const uploadResult = await uploadImageToS3(
                reqBody.bannerImage,
                `businessList/banners/banner-${Date.now()}`
            );
            reqBody.bannerImageKey = uploadResult.key;
            delete reqBody.bannerImage;
        }

        if (reqBody.businessImages?.length > 0) {
            const businessImageKeys = await Promise.all(
                reqBody.businessImages.map(async (img, i) => {
                    const uploadResult = await uploadImageToS3(
                        img,
                        `businessList/gallery/image-${Date.now()}-${i}`
                    );
                    return uploadResult.key;
                })
            );
            reqBody.businessImagesKey = businessImageKeys;
            delete reqBody.businessImages;
        }

        const businessListDocument = new businessListModel(reqBody);
        const result = await businessListDocument.save();
        return result;
    } catch (error) {
        console.error("Error saving business:", error);
        throw error;
    }
};

export const viewBusinessList = async (id) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid business ID");

    const business = await businessListModel.findById(id).lean();
    if (!business) throw new Error("Business not found");

    if (business.bannerImageKey) business.bannerImage = getSignedUrlByKey(business.bannerImageKey);
    if (business.businessImagesKey?.length > 0) {
        business.businessImages = business.businessImagesKey.map(key => getSignedUrlByKey(key));
    }

    return business;
};


export const viewAllBusinessList = async () => {
    const businessList = await businessListModel.find().lean();
    if (!businessList || businessList.length === 0) throw new Error("No business found");

    return businessList.map(business => {
        if (business.bannerImageKey) business.bannerImage = getSignedUrlByKey(business.bannerImageKey);
        if (business.businessImagesKey?.length > 0) {
            business.businessImages = business.businessImagesKey.map(key => getSignedUrlByKey(key));
        }
        return business;
    });
};


export const updateBusinessList = async (id, data) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid business ID");

    const business = await businessListModel.findById(id);
    if (!business) throw new Error("Business not found");

    if (data.bannerImage?.startsWith("data:image")) {
        const uploadResult = await uploadImageToS3(
            data.bannerImage,
            `businessList/banners/banner-${Date.now()}`
        );
        business.bannerImageKey = uploadResult.key;
    } else if (data.bannerImage === null || data.bannerImage === "") {
        business.bannerImageKey = "";
    }
    delete data.bannerImage;

    if (Array.isArray(data.businessImages)) {
        const oldKeys = (business.businessImagesKey || []).filter(k => k && !k.startsWith("https://"));

        const newImages = data.businessImages.filter(img => img.startsWith("data:image"));

        const newKeys = await Promise.all(
            newImages.map(async (img, i) => {
                const uploadResult = await uploadImageToS3(
                    img,
                    `businessList/gallery/image-${Date.now()}-${i}`
                );
                return uploadResult.key;
            })
        );

        business.businessImagesKey = [...new Set([...oldKeys, ...newKeys])];
    } else if (data.businessImages === null) {
        business.businessImagesKey = [];
    }

    delete data.businessImages;

    Object.keys(data).forEach(key => {
        business[key] = data[key];
    });

    await business.save();

    const result = business.toObject();
    if (business.bannerImageKey) result.bannerImage = getSignedUrlByKey(business.bannerImageKey);
    if (business.businessImagesKey?.length > 0) {
        result.businessImages = business.businessImagesKey.map(key => getSignedUrlByKey(key));
    }

    return result;
};

export const deleteBusinessList = async (id) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid business ID");

    const deletedBusiness = await businessListModel.findByIdAndDelete(id);
    if (!deletedBusiness) throw new Error("Business not found");

    return deletedBusiness;
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


export const getTrendingSearches = async (limit = 4) => {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const pipeline = [
        { $match: { createdAt: { $gte: twoDaysAgo } } },
        { $group: { _id: "$categoryName", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { _id: 0, name: "$_id", path: { $concat: ["/trending/", { $toLower: "$_id" }] } } },
    ];

    return await SearchLogModel.aggregate(pipeline);
};

