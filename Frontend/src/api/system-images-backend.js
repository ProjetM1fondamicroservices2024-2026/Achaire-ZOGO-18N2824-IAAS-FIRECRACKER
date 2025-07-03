import axios from 'axios';

const SERVICE_NAME = 'SERVICE-SYSTEM-IMAGE';
const IMAGE_URI = 'api/service-system-image';

export const getSystemImages = async()=>{

    const res = await axios.get(`/${SERVICE_NAME}/${IMAGE_URI}/`)
                        .catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to get system images error code ${res.status}`);
    }

    

    const resData = await res.data;
    console.log(resData);
    return resData.data.data.system_images;

}



export const getSystemImageByid = async(id)=>{

    const res = await axios.get(`/${SERVICE_NAME}/${IMAGE_URI}/${id}`)
                        .catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to get system image ${id} error code ${res.status}`);
    }

    const resData = await res.data;
    console.log(resData);
    return resData.data.data;

}

export const createSystemImages = async(data) => {
    
    
    const res = await axios.post(`/${SERVICE_NAME}/${IMAGE_URI}/`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    .catch((err) => console.log(err));
    
    if (res.status !== 201) {
        return console.log(`Failed to create system images error code ${res.status}`);
    }

    const resData = await res.data;
    return resData;
}



export const updateSystemImages = async(data,id)=>{

    const res = await axios.put(`/${SERVICE_NAME}/${IMAGE_URI}/${id}`,
        {
            name: data.name,
            os_type: data.os_type,
            version: data.version,
            description: data.description,
            image: data.image

        }
    )
    .catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to update system images error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;

}



export const deleteSystemImages = async(id)=>{

    const res = await axios.delete(`/${SERVICE_NAME}/${IMAGE_URI}/${id}`)
    .catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to delete system image ${id} error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;

}





export const searchSystemImages = async(name)=>{

    const res = await axios.get(`/${SERVICE_NAME}/${IMAGE_URI}/search/${name}`)
    .catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to create system images error code ${res.status}`);
    }

    const resData = await res.data;

    return resData.data.system_images;

}



export const getSystemImageByOsType = async(os_type)=>{

    const res = await axios.get(`/${SERVICE_NAME}/${IMAGE_URI}/os-type/${os_type}`)
    .catch((err)=>console.log(err));


    if (res.status !== 200){
        return console.log(`Failed to search system images using os type error code ${res.status}`);
    }
    console.log(res.data);
    const resData = await res.data;

    return resData.data.system_images;

}




export const getHealthCheck = async(data)=>{

    const res = await axios.get(`/${SERVICE_NAME}/health` )
    .catch((err)=>console.log(err));


    if (res.status !== 201){
        return console.log(`Failed to get health check of system image service error code ${res.status}`);
    }

    const resData = await res.data;

    return resData;

}