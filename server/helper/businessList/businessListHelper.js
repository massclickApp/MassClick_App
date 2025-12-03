import { ObjectId } from "mongodb";
import businessListModel from "../../model/businessList/businessListModel.js";
import SearchLogModel from "../../model/businessList/searchLogModel.js";
import mongoose from "mongoose";
import { uploadImageToS3, getSignedUrlByKey } from "../../s3Uploder.js";
import locationModel from "../../model/locationModel/locationModel.js";
import userModel from "../../model/userModel.js";

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
        if (reqBody.kycDocuments?.length > 0) {
            const kycDocumentsKey = await Promise.all(
                reqBody.kycDocuments.map(async (doc, i) => {
                    const uploadResult = await uploadImageToS3(
                        doc,
                        `businessList/kyc/document-${Date.now()}-${i}`
                    );
                    return uploadResult.key;
                })
            );
            reqBody.kycDocumentsKey = kycDocumentsKey;
            delete reqBody.kycDocuments;
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
    if (business.kycDocumentsKey?.length > 0)
        business.kycDocuments = business.kycDocumentsKey.map((key) => getSignedUrlByKey(key));


    return business;
};


export const viewAllClientBusinessList = async () => {
    const businessList = await businessListModel.find().lean();
    if (!businessList || businessList.length === 0) throw new Error("No business found");

    return businessList.map(business => {
        if (business.bannerImageKey) business.bannerImage = getSignedUrlByKey(business.bannerImageKey);
        if (business.businessImagesKey?.length > 0) {
            business.businessImages = business.businessImagesKey.map(key => getSignedUrlByKey(key));
        }
        if (business.kycDocumentsKey?.length > 0)
            business.kycDocuments = business.kycDocumentsKey.map((key) => getSignedUrlByKey(key));
        return business;
    });
};

// export const viewAllBusinessList = async (role, userId) => {
//   let query = {};

//   if (role === "SuperAdmin") {
//     query = {}; 
//   } 
//   else if (role === "SalesManager") {
//     const manager = await userModel.findById(userId).lean();
//     const salesOfficerIds = manager?.salesBy || [];
//     if (salesOfficerIds.length === 0) throw new Error("No sales officers assigned to this manager");
//     query = { createdBy: { $in: salesOfficerIds } };
//   } 
//   else if (role === "SalesOfficer") {
//     query = { createdBy: new mongoose.Types.ObjectId(userId) };
//   } 
// //   else if (role === "user" || role === "client") {
// //     query = { isActive: true };
// //   } 
//   else {
//     throw new Error("Unauthorized role");
//   }

//   const businessList = await businessListModel.find(query).lean();
//   if (!businessList || businessList.length === 0) throw new Error("No business found");

//   const businessListWithDetails = await Promise.all(
//     businessList.map(async (business) => {
//       if (business.bannerImageKey) business.bannerImage = getSignedUrlByKey(business.bannerImageKey);
//       if (business.businessImagesKey?.length > 0)
//         business.businessImages = business.businessImagesKey.map((key) => getSignedUrlByKey(key));

//       let locationDetailsArray = [];
//       if (business.location && mongoose.Types.ObjectId.isValid(business.location)) {
//         const location = await locationModel.findById(business.location).lean();
//         if (location) {
//           locationDetailsArray = [
//             location.addressLine1 || "",
//             location.addressLine2 || "",
//             location.pincode || "",
//             location.city || "",
//             location.state || "",
//             location.country || "",
//           ];
//         }
//       } else if (business.location) {
//         locationDetailsArray = [business.location];
//       }

//       business.locationDetails = locationDetailsArray.filter(Boolean).join(", ");
//       return business;
//     })
//   );

//   return businessListWithDetails;
// };
export const viewAllBusinessList = async (role, userId, pageNo, pageSize) => {
    let query = {};

    if (role === "SuperAdmin") {
        query = {};
    } else if (role === "SalesManager") {
        const manager = await userModel.findById(userId).lean();
        const salesOfficerIds = manager?.salesBy || [];

        const allowedCreators = [
            new mongoose.Types.ObjectId(userId),
            ...salesOfficerIds.map((id) => new mongoose.Types.ObjectId(id)),
        ];

        query = { createdBy: { $in: allowedCreators } };
    } else if (role === "SalesOfficer") {
        query = { createdBy: new mongoose.Types.ObjectId(userId) };
    } else if (["client", "PublicUser", "user"].includes(role)) {
        query = { isActive: true };
    } else {
        throw new Error("Unauthorized role");
    }

    const total = await businessListModel.countDocuments(query);

    const businessList = await businessListModel
        .find(query)
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize)
        .lean();

    const businessListWithDetails = await Promise.all(
        businessList.map(async (business) => {
            if (business.bannerImageKey)
                business.bannerImage = getSignedUrlByKey(business.bannerImageKey);

            if (business.businessImagesKey?.length > 0)
                business.businessImages = business.businessImagesKey.map((key) =>
                    getSignedUrlByKey(key)
                );

            if (business.kycDocumentsKey?.length > 0)
                business.kycDocuments = business.kycDocumentsKey.map((key) =>
                    getSignedUrlByKey(key)
                );

            let locationDetailsArray = [];
            if (
                business.location &&
                mongoose.Types.ObjectId.isValid(business.location)
            ) {
                const location = await locationModel.findById(business.location).lean();
                if (location) {
                    locationDetailsArray = [location.city || "", location.state || ""];
                }
            } else if (business.location) {
                locationDetailsArray = [business.location];
            }

            business.locationDetails = locationDetailsArray.filter(Boolean).join(", ");
            return business;
        })
    );

    return { list: businessListWithDetails, total };
};


export const updateBusinessList = async (id, data) => {
  if (!ObjectId.isValid(id)) throw new Error("Invalid business ID");

  const business = await businessListModel.findById(id);
  if (!business) throw new Error("Business not found");

  if (data.reviewData) {
    const { reviewData } = data;

    const uploadedPhotoKeys = [];
    if (Array.isArray(reviewData.ratingPhotos) && reviewData.ratingPhotos.length > 0) {
      const photoUploadPromises = reviewData.ratingPhotos.map(async (img, i) => {
        if (img.startsWith("data:image")) {
          const uploadResult = await uploadImageToS3(
            img,
            `businessList/reviews/${business._id}/photo-${Date.now()}-${i}`
          );
          return uploadResult.key;
        }
        return null;
      });

      uploadedPhotoKeys.push(...(await Promise.all(photoUploadPromises)).filter(key => key));
    }

    const newReview = {
      ...reviewData,
      ratingPhotos: uploadedPhotoKeys,
      createdAt: new Date(),
    };

    business.reviews.push(newReview);

    const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
    business.averageRating = business.reviews.length > 0
      ? parseFloat((totalRating / business.reviews.length).toFixed(1))
      : 0;

    delete data.reviewData;
  }

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
    const oldKeys = business.businessImagesKey || [];
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

  if (Array.isArray(data.kycDocuments)) {
    const oldKycKeys = business.kycDocumentsKey || [];
    const newKycDocs = data.kycDocuments.filter(doc => doc.startsWith("data:"));

    const newKycKeys = await Promise.all(
      newKycDocs.map(async (doc, i) => {
        const uploadResult = await uploadImageToS3(
          doc,
          `businessList/kyc/document-${Date.now()}-${i}`
        );
        return uploadResult.key;
      })
    );

    business.kycDocumentsKey = [...new Set([...oldKycKeys, ...newKycKeys])];
  } else if (data.kycDocuments === null) {
    business.kycDocumentsKey = [];
  }
  delete data.kycDocuments;

  Object.keys(data).forEach(key => {
    if (!['reviews', 'averageRating', 'clientId'].includes(key)) {
      business[key] = data[key];
    }
  });

  await business.save();
  const result = business.toObject();

  if (business.bannerImageKey)
    result.bannerImage = getSignedUrlByKey(business.bannerImageKey);

  if (business.businessImagesKey?.length > 0)
    result.businessImages = business.businessImagesKey.map(key => getSignedUrlByKey(key));

  if (business.kycDocumentsKey?.length > 0)
    result.kycDocuments = business.kycDocumentsKey.map(key => getSignedUrlByKey(key));

  result.reviews = result.reviews.map(review => ({
    ...review,
    ratingPhotos: review.ratingPhotos.map(key => getSignedUrlByKey(key)),
  }));

  return result;
};


// export const updateBusinessList = async (id, data) => {
//     if (!ObjectId.isValid(id)) throw new Error("Invalid business ID");

//     const business = await businessListModel.findById(id);
//     if (!business) throw new Error("Business not found");


//     if (data.reviewData) {
//         const { reviewData } = data;

//         const uploadedPhotoKeys = [];
//         if (Array.isArray(reviewData.ratingPhotos) && reviewData.ratingPhotos.length > 0) {
//             const photoUploadPromises = reviewData.ratingPhotos.map(async (img, i) => {
//                 if (img.startsWith("data:image")) {
//                     const uploadResult = await uploadImageToS3(
//                         img,
//                         `businessList/reviews/${business._id}/photo-${Date.now()}-${i}`
//                     );
//                     return uploadResult.key;
//                 }
//                 return null;
//             });

//             uploadedPhotoKeys.push(...(await Promise.all(photoUploadPromises)).filter(key => key));
//         }

//         const newReview = {
//             ...reviewData, // Contains rating, experience, love, userId, username
//             ratingPhotos: uploadedPhotoKeys, // Use the uploaded S3 Keys
//             createdAt: new Date() // Set the creation time
//         };

//         business.reviews.push(newReview);

//         const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
//         business.averageRating = business.reviews.length > 0
//             ? parseFloat((totalRating / business.reviews.length).toFixed(1))
//             : 0;

//         delete data.reviewData;
//     }




//     if (data.bannerImage?.startsWith("data:image")) {
//         const uploadResult = await uploadImageToS3(
//             data.bannerImage,
//             `businessList/banners/banner-${Date.now()}`
//         );
//         business.bannerImageKey = uploadResult.key;
//     } else if (data.bannerImage === null || data.bannerImage === "") {
//         business.bannerImageKey = "";
//     }
//     delete data.bannerImage;

//     if (Array.isArray(data.businessImages)) {
//         const oldKeys = (business.businessImagesKey || []).filter(k => k && !k.startsWith("https://"));

//         const newImages = data.businessImages.filter(img => img.startsWith("data:image"));

//         const newKeys = await Promise.all(
//             newImages.map(async (img, i) => {
//                 const uploadResult = await uploadImageToS3(
//                     img,
//                     `businessList/gallery/image-${Date.now()}-${i}`
//                 );
//                 return uploadResult.key;
//             })
//         );

//         business.businessImagesKey = [...new Set([...oldKeys, ...newKeys])];
//     } else if (data.businessImages === null) {
//         business.businessImagesKey = [];
//     }
//     delete data.businessImages;

//     Object.keys(data).forEach(key => {
//         if (key !== 'reviews' && key !== 'averageRating' && key !== 'clientId') {
//             business[key] = data[key];
//         }
//     });

//     await business.save();

//     const result = business.toObject();


//     if (business.bannerImageKey) result.bannerImage = getSignedUrlByKey(business.bannerImageKey);
//     if (business.businessImagesKey?.length > 0) {
//         result.businessImages = business.businessImagesKey.map(key => getSignedUrlByKey(key));
//     }

//     result.reviews = result.reviews.map(review => ({
//         ...review,
//         ratingPhotos: review.ratingPhotos.map(key => getSignedUrlByKey(key))
//     }));

//     return result;
// };

export const deleteBusinessList = async (id) => {
    if (!ObjectId.isValid(id)) throw new Error("Invalid business ID");

    const deletedBusiness = await businessListModel.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
    );

    if (!deletedBusiness) {
        throw new Error("Business not found");
    }

    return deletedBusiness;
};
export const restoreBusinessList = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid business ID");

    const restoredBusiness = await businessListModel.findByIdAndUpdate(
        id,
        { isActive: true, updatedAt: new Date() },
        { new: true }
    );

    if (!restoredBusiness) throw new Error("Business not found");

    return restoredBusiness;
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

