import { axios } from "./axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firebaseInstance } from '../firebase';

export async function createRequest(Body, documentFileObject) {
    try {
        console.log("The body is:", Body);

        // for (let [key, value] of Body.entries()) {
        //     console.log(`${key}: ${value}`);
        // }

        // Send the initial request to create the request object
        console.log("the document is", documentFileObject);
        const response = await axios.post("/request", Body);
        console.log("Created request:", response.data); // Log the created request
        console.log("document", documentFileObject);
        if (documentFileObject) {
            const storage = getStorage(firebaseInstance); // Correctly getting the storage instance
            const date = new Date().toISOString(); // Gets the current date in ISO format
            const fileName = `${document.name}_${date}`;
            const storageRef = ref(storage, fileName); // Creating a reference to the file in Firebase Storage
            console.log("IN service document", documentFileObject);
            await uploadBytesResumable(storageRef, documentFileObject);
            const url = await getDownloadURL(storageRef); // Getting the download URL
            console.log("url", url);

            console.log("The Firebase service URL is", url);
            await updateRequest(response.data._id, { "document": url });
        }
    } catch (error) {
        const errorMessage = error.response?.data?.error || "An error occurred while creating the request.";
        console.log("ERROR MESSAGE", errorMessage);
        console.log(error);
        throw new Error(errorMessage);
    }
}

export async function updateRequest(id, urlObject) {
    try {
        console.log("Updating request to add", urlObject);
        const response = await axios.put(`/requestDocument/${id}`, urlObject);

        console.log("Updated request data:", response.data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "An error occurred while updating the request.";
        console.log("ERROR MESSAGE", errorMessage);
        throw new Error(errorMessage);
    }
}


export async function acceptRequest(id) {
    try {
        console.log("Accepting request with ID:", id);

        const response = await axios.put(`/request/${id}`, { status: "accepted" });

        return response.data;
    } catch (error) {

        const errorMessage = error.response?.data?.error || "An error occurred while accepting the request.";
        console.log("ERROR MESSAGE", errorMessage);
        throw new Error(errorMessage);
    }
}


export async function getRequest(id) {
    try {
        console.log("Retrieving request with ID:", id);
        const response = await axios.get(`/request/${id}`);
        return response.data;
    } catch (error) {
        // Check if error.response and error.response.data exist and provide the correct message
        const errorMessage = error.response?.data?.error || "An error occurred while retrieving the request.";
        console.log("ERROR MESSAGE", errorMessage);
        throw new Error(errorMessage);
    }
}
